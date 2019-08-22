const connection = require('../config/database.js')

class ImagesSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS images ( \
             name VARCHAR(255) PRIMARY KEY, \
             user_id INT NOT NULL, \
             CONSTRAINT UN_tag UNIQUE (name), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table images failed in database/migrations/ImagesSchema ' + error)
    }
  }

}

module.exports = ImagesSchema
