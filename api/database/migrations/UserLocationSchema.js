const connection = require('../../middleware/database')

class UserLocationSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS location_users ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             provided BOOLEAN DEFAULT 0 NOT NULL, \
             geo TEXT NOT NULL, \
             lat DECIMAL(9,6) NOT NULL, \
             lng DECIMAL(9,6) NOT NULL, \
             CONSTRAINT u_user_id UNIQUE (user_id), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating user location table ', err) })
    }

}

module.exports = UserLocationSchema