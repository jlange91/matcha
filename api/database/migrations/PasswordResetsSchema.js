const connection = require('../../middleware/database')

class PasswordResetsSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS password_resets ( \
            id INT AUTO_INCREMENT PRIMARY KEY, \
            user_id INT NOT NULL, \
            email VARCHAR(64) NOT NULL,\
            hash  VARCHAR(255) NOT NULL,\
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
            CONSTRAINT UH_email_confirmation UNIQUE (hash), \
            CONSTRAINT UE_email_confirmation UNIQUE (email), \
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'
            
        connection.query(sql, (err) => {if (err) console.log('Error while creating email table ', err) })
    }

}

module.exports = PasswordResetsSchema