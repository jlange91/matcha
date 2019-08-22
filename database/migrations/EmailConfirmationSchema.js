const connection = require('../config/database.js')

class EmailConfirmationSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS email_confirmations ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             email VARCHAR(64) NOT NULL,\
             hash  VARCHAR(255) NOT NULL,\
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UH_email_confirmation UNIQUE (hash), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
      } catch (error) {
        throw new Error('CREATE table email_confirmations failed in database/migrations/EmailConfirmationSchema ' + error)
      }
    }

}

module.exports = EmailConfirmationSchema
