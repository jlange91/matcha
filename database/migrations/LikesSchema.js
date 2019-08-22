const connection = require('../config/database.js')

class LikesSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS likes ( \
             user_id INT NOT NULL, \
             liked_id INT NOT NULL, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (liked_id) REFERENCES users (id) ON DELETE CASCADE, \
             UNIQUE KEY (user_id, liked_id))'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table likes failed in database/migrations/LikesSchema ' + error)
    }
  }

}

module.exports = LikesSchema
