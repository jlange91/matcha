const connection = require('../../middleware/database')

class ViewsSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS views ( \
            id INT AUTO_INCREMENT PRIMARY KEY, \
            user_id INT NOT NULL, \
            viewed_id INT NOT NULL, \
            count INT NOT NULL, \
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
            FOREIGN KEY (viewed_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating Views table ', err) })
    }

}

module.exports = ViewsSchema