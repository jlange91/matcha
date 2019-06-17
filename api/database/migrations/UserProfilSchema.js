const connection = require('../../middleware/database')
// add birth date and completed 
class UserProfilSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS profils ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             birthdate DATE DEFAULT NULL, \
             gender ENUM("female", "male") DEFAULT NULL, \
             sexual_orientation ENUM("bisexual", "female", "male") NOT NULL, \
             biography TEXT DEFAULT NULL, \
             completed BOOLEAN DEFAULT 0 NOT NULL, \
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL, \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating user profil table ', err) })
    }

}

module.exports = UserProfilSchema