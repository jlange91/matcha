const connection = require('../../middleware/database')

class UserSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS users ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             email VARCHAR(255), \
             username VARCHAR(30), \
             first_name VARCHAR(30), \
             last_name VARCHAR(30), \
             password VARCHAR(255), \
             confirmed TINYINT DEFAULT 0 NOT NULL, \
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UN_user UNIQUE (username))'

        connection.query(sql, (err) => {if (err) console.log('Error while creating users table ', err) })
    }

}

module.exports = UserSchema