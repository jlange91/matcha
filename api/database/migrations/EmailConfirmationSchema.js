const connection = require('../../middleware/database')

class EmailConfirmationSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS email_confirmations ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             email VARCHAR(64) NOT NULL,\
             hash  VARCHAR(255) NOT NULL,\
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UH_email_confirmation UNIQUE (hash), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating email table ', err) })
    }

}

module.exports = EmailConfirmationSchema