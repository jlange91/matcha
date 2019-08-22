const connection = require('../config/database.js')
// add birth date and completed
class UserProfilSchema {

    static async createTable() {
      try {
        const sql = 'CREATE TABLE IF NOT EXISTS profils ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             user_id INT NOT NULL, \
             birthdate DATE DEFAULT NULL, \
             gender ENUM("female", "male") DEFAULT NULL, \
             sexual_orientation ENUM("bisexual", "female", "male") NOT NULL, \
             biography TEXT DEFAULT NULL, \
             completed BOOLEAN DEFAULT 0 NOT NULL, \
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UN_user UNIQUE (user_id), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        await connection.query(sql)
    } catch (error) {
      throw new Error('CREATE table profils failed in database/migrations/UserProfilSchema ' + error)
    }
  }

}

module.exports = UserProfilSchema
