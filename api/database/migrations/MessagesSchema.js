const connection = require('../../middleware/database')

class MessagesSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS messages ( \
            id INT AUTO_INCREMENT PRIMARY KEY, \
            from_id INT NOT NULL, \
            to_id INT NOT NULL, \
            body TEXT NOT NULL, \
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
            FOREIGN KEY (from_id) REFERENCES users (id) ON DELETE CASCADE, \
            FOREIGN KEY (to_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating matchs table ', err) })
    }

}

module.exports = MessagesSchema
