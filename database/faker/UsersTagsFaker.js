const connection = require('../config/database.js')

class UsersTagsFaker {

  static async createUserTags(users) {
    for (var i = 0; users[i]; i++) {
      try {
        let sql = 'INSERT INTO user_tag (user_id, tag_id) \
                   VALUES ((SELECT id from users WHERE username = ?), (SELECT id from tags ORDER BY RAND() LIMIT 1))'
        await connection.query({sql, timeout: 40000, values: [users[i].username]})
        
        sql = 'INSERT INTO user_tag (user_id, tag_id) \
                   VALUES (1, (SELECT id from tags ORDER BY RAND() LIMIT 1))'
        await connection.query({sql, timeout: 40000})
       
        sql = 'INSERT INTO user_tag (user_id, tag_id) \
                   VALUES (2, (SELECT id from tags ORDER BY RAND() LIMIT 1))'
        await connection.query({sql, timeout: 40000})
 
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/UsersLocationFaker.setUsersLocation ' + error)
      }
    }
    }
  }

module.exports = UsersTagsFaker