const connection = require('../../middleware/database')

class LikesSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS likes ( \
             user_id INT NOT NULL, \
             liked_id INT NOT NULL, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (liked_id) REFERENCES users (id) ON DELETE CASCADE, \
             UNIQUE KEY (user_id, liked_id))'

        connection.query(sql, (err) => {if (err) console.log('Error while creating matchs table ', err) })
    }

}

module.exports = LikesSchema
