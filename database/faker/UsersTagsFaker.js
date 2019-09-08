const connection = require('../config/database.js')

class UsersTagsFaker {

  static async createUserTags() {
    for (var i = 0; i < 200; i++) {
      try {
        let sql = 'INSERT INTO user_tag (user_id, tag_id) \
                   VALUES ((SELECT id from users ORDER BY RAND() LIMIT 1), (SELECT id from tags ORDER BY RAND() LIMIT 1))'
        await connection.query({sql, timeout: 40000})
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/UsersLocationFaker.setUsersLocation ' + error)
      }
    }
    }
  }

module.exports = UsersTagsFaker