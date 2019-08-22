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
             VALUES ("8e05472833c74fc3bb1825b3d5364482.jpg", (SELECT id from users WHERE username = "dadacruz"))'

         await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 2 failed in database/faker/ImageFaker.setAdmins ' + error)
      }
    }
}

module.exports = ImageFaker
