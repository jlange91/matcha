const connection = require('../../middleware/database')

class UserTagSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS user_tag ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             tag_id INT NOT NULL, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating user tag table ', err) })
    }

}

module.exports = UserTagSchema