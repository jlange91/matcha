const connection = require('../config/database.js')

class LikesFaker {

    static async setAdmins() {
      try {
       var sql = 'INSERT IGNORE INTO likes \
            (user_id, liked_id) \
            VALUES ((SELECT id from users WHERE username = "jlange"), (SELECT id from users WHERE username = "dadacruz"))'

        await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 1 failed in database/faker/LikesFaker.setAdmins ' + error)
      }
      try {
        sql = 'INSERT IGNORE INTO likes \
             (user_id, liked_id) \
             VALUES ((SELECT id from users WHERE username = "dadacruz"), (SELECT id from users WHERE username = "jlange"))'

         await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 2 failed in database/faker/LikesFaker.setAdmins ' + error)
      }
    }

}

module.exports = LikesFaker
