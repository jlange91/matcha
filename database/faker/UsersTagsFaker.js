const connection = require('../config/database.js')
const faker = require('faker')

class UsersTagsFaker {

  static async createUserTags(users) {
      try {

        let sql = 'SELECT id FROM tags'

        const tag_ids = await connection.query({sql, timeout: 40000})

        for(var i = 3; i < users.length; i++) {

          for (let index = 0; index < 10; index++) {
            try {
              sql = 'INSERT INTO user_tag (user_id, tag_id) \
                         VALUES (?, ?)'
              // console.log(users[i], tag_ids[index])
              await connection.query({sql, timeout: 40000, values: [i, tag_ids[faker.random.number(99)].id]})

            } catch (error) {
              throw new Error('INSERT ' + i + ' failed in database/faker/UsersTagsFaker.createUserTags ' + error)
            }

          }

        }

      } catch (error) {
        throw new Error('SELECT failed in database/faker/UsersTagsFaker.createUserTags ' + error)
      }
    }

  }

module.exports = UsersTagsFaker
