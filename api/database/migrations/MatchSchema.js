const connection = require('../../middleware/database')

class MatchSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS matchs ( \
             user_id INT NOT NULL, \
             match_id INT NOT NULL, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (match_id) REFERENCES users (id) ON DELETE CASCADE, \
             UNIQUE KEY (user_id, match_id))'

        connection.query(sql, (err) => {if (err) console.log('Error while creating matchs table ', err) })
    }

}

module.exports = MatchSchema
