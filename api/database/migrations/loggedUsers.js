const connection = require('../../middleware/database')

class loggedUsers {

    static async createTable() {
        const sql = 'DROP TABLE IF EXISTS logged_users; \
            CREATE TABLE IF NOT EXISTS logged_users ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             socket_id VARCHAR(255) NOT NULL,\
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating email table ', err) })
    }
}

module.exports = loggedUsers
