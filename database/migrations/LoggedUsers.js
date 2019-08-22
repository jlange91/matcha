const connection = require('../config/database.js')

class LoggedUsers {

    static async createTable() {
      try {
        const sql = 'DROP TABLE IF EXISTS logged_users; \
            CREATE TABLE IF NOT EXISTS logged_users ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             socket_id VARCHAR(255) NOT NULL,\
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table logged_users failed in database/migrations/LoggedUsers ' + error)
    }
  }

}

module.exports = LoggedUsers
