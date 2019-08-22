const connection = require('../config/database.js')

class ViewsSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS views ( \
            id INT AUTO_INCREMENT PRIMARY KEY, \
            user_id INT NOT NULL, \
            viewed_id INT NOT NULL, \
            count INT NOT NULL, \
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
            FOREIGN KEY (viewed_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table views failed in database/migrations/ViewsSchema ' + error)
    }
  }

}

module.exports = ViewsSchema
