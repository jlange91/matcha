const connection = require('../../middleware/database')
// add birth date and completed
class NotificationsSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS notifications ( \
             user_id INT NOT NULL, \
             notified_id INT NOT NULL, \
             type ENUM("like", "view", "message", "match", "unlike") NOT NULL, \
             seen BOOLEAN NOT NULL DEFAULT 0, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, \
             FOREIGN KEY (notified_id) REFERENCES users (id) ON DELETE CASCADE, \
             UNIQUE KEY (user_id, notified_id, type))'

        connection.query(sql, (err) => {if (err) console.log('Error while creating notifications table ', err) })
    }

}

module.exports = NotificationsSchema
