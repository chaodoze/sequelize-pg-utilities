/*
 *  This is excluded from code coverage reporting due to a bug in instanbul
 *  whereby it will not ignore the if on line 49 unless I add a ; to the preceeding line.
 *
 *  TODO: revisit this when the bug is fixed.
 */

/**
 * Generate a Sequelize configuration object using a mix of environment variables,
 * a supplied config file, and other optional parameters.
 *
 * @param config — The content of the `config/config.json` file. Required, no default.
 * @param defaultDbName — If the database name is not set an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
 * @param operatorsAliases — Sequelize recommends you don't use [operators aliases](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-aliases), but if you want to you can set them here.  Optional, default is `false`.
 * @param logger — You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything.
 * @return { name, user, password, options }
 */
const configure = (
  config,
  defaultDbName,
  operatorsAliases = false,
  logger = false
) => {
  const name =
    process.env.DB_NAME ||
    config.database ||
    /* istanbul ignore next */ defaultDbName
  const user =
    process.env.DB_USER || config.username || /* istanbul ignore next */ null
  const password =
    process.env.DB_PASS || config.password || /* istanbul ignore next */ null

  /* istanbul ignore next */
  const poolOptions = config.pool
    ? {
        max: process.env.DB_POOL_MAX || config.pool.max || 5,
        min: process.env.DB_POOL_MIN || config.pool.min || 1,
        idle: process.env.DB_POOL_IDLE || config.pool.idle || 10000
      }
    : {
        max: process.env.DB_POOL_MAX || 5,
        min: process.env.DB_POOL_MIN || 1,
        idle: process.env.DB_POOL_IDLE || 10000
      }

  const options = {
    host:
      process.env.DB_HOST ||
      config.host ||
      /* istanbul ignore next */ 'localhost',
    port: process.env.DB_PORT || config.port || 5432,
    dialect:
      process.env.DB_TYPE ||
      config.dialect ||
      /* istanbul ignore next */ 'postgres',
    pool: poolOptions,
    operatorsAliases, // see https://github.com/sequelize/sequelize/issues/8417
    logging: logger // this can be a logging function.
  }

  /* istanbul ignore if */
  if (process.env.DATABASE_URL) options.protocol = config.protocol

  return { name, user, password, options }
}

module.exports = configure
