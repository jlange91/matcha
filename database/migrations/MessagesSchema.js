const connection = require('../config/database.js')

class MessagesSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS messages ( \
            id INT AUTO_INCREMENT PRIMARY KEY, \
            from_id INT NOT NULL, \
            to_id INT NOT NULL, \
            body TEXT NOT NULL, \
            seen BOOLEAN NOT NULL DEFAULT false, \
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
            FOREIGN KEY (from_id) REFERENCES users (id) ON DELETE CASCADE, \
            FOREIGN KEY (to_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table messages failed in database/migrations/MessagesSchema ' + error)
    }
  }

}

module.exports = MessagesSchema
