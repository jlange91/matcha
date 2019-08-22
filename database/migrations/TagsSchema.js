const connection = require('../config/database.js')

class TagsSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS tags ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             name VARCHAR(255), \
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UN_tag UNIQUE (name))'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table tags failed in database/migrations/TagsSchema ' + error)
    }
  }

}

module.exports = TagsSchema
