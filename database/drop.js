const connection = require('./config/database.js')

const dropDatabase = async () => {
  try {
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`)
    // set the db for the rest of the queries
    connection.config.connectionConfig.database = process.env.DB_NAME
  } catch (err) {
    throw new Error('Database drop failed in database/drop ' + err)
  }
}

const exitProperly = () => {
  process.exit()
}

class Drop {
    async database () {
      await dropDatabase();
      exitProperly()
    }
}

const drop = new Drop();
drop.database()
