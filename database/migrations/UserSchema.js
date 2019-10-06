const connection = require('../config/database.js')

class UserSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS users ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             email VARCHAR(255), \
             username VARCHAR(30), \
             first_name VARCHAR(30), \
             last_name VARCHAR(30), \
             password VARCHAR(255), \
             avatar VARCHAR(255) DEFAULT "default.png", \
             confirmed TINYINT DEFAULT 0 NOT NULL, \
             spam TINYINT DEFAULT 0 NOT NULL, \
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UN_user UNIQUE (username))'

        await connection.query(sql)
        return ;
      } catch (error) {
          throw new Error('CREATE table users failed in database/migrations/UserSchema ' + error)
      }
    }
}

module.exports = UserSchema
