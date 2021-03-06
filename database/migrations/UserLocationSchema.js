const connection = require('../config/database.js')

class UserLocationSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS location_users ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             provided BOOLEAN DEFAULT 0 NOT NULL, \
             geo TEXT NOT NULL, \
             lat DECIMAL(9,6) NOT NULL, \
             lng DECIMAL(9,6) NOT NULL, \
             CONSTRAINT u_user_id UNIQUE (user_id), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table location_users failed in database/migrations/UserLocationSchema ' + error)
    }
  }

}

module.exports = UserLocationSchema
