const connection = require('../config/database.js')

class UsersTagsFaker {

  static async createUserTags() {
    // for (var i = 0; users[i]; i++) {
      try {

        let sql = 'SELECT id FROM tags'
        
        const tag_ids =  await connection.query({sql, timeout: 40000})
        
        sql = 'SELECT id FROM users'

        const user_ids = await connection.query({sql, timeout: 40000})
        
        for(var i = 0; i < user_ids.length; i++) {
          
          for (let index = 0; index < tag_ids.length; index++) {
            try {
              sql = 'INSERT INTO user_tag (user_id, tag_id) \
                         VALUES (?, ?)'
              // console.log(user_ids[i], tag_ids[index])
              await connection.query({sql, timeout: 40000, values: [user_ids[i].id, tag_ids[index].id]})

            } catch (error) {
              throw new Error('INSERT ' + i + ' failed in database/faker/createUserTags ' + error)
            }
            
          }
          
        }
 
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/createUserTags ' + error)
      }
    }
    
  }

module.exports = UsersTagsFaker