const connection = require('../config/database.js')
// add birth date and completed
class NotificationsSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS notifications ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             notified_id INT NOT NULL, \
             type ENUM("like", "view", "message", "match", "unlike") NOT NULL, \
             seen BOOLEAN NOT NULL DEFAULT 0, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (notified_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table notifications failed in database/migrations/NotificationsSchema ' + error)
    }
  }

}

module.exports = NotificationsSchema
