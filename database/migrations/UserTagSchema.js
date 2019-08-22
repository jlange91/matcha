const connection = require('../config/database.js')

class UserTagSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS user_tag ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             tag_id INT NOT NULL, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table user_tag failed in database/migrations/UserTagSchema ' + error)
    }
  }

}

module.exports = UserTagSchema
