const connection = require('../config/database.js')

class ImageFaker {

    static async setAdmins() {
      try {
       var sql = 'INSERT IGNORE INTO images \
            (name, user_id) \
            VALUES ("24eef96049084e24a22416565ec45c73.jpg", (SELECT id from users WHERE username = "jlange"))'

        await connection.query(sql)

      } catch (error) {
        throw new Error('INSERT 1 failed in database/faker/ImageFaker.setAdmins ' + error)
      }
      try {
        sql = 'INSERT IGNORE INTO images \
             (name, user_id) \
             VALUES ("d6d894d4853547a2ac1ec25029f0cc84.jpg", (SELECT id from users WHERE username = "dadacruz"))'

         await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 2 failed in database/faker/ImageFaker.setAdmins ' + error)
      }
    }
}

module.exports = ImageFaker
