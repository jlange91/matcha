const connection = require('../config/database.js')
const faker = require('faker')

class UsersTagsFaker {

  static async createAdminTags() {
    try {

      let sql = 'SELECT id FROM tags'
      const nbTags = 5

      const tag_ids = await connection.query({sql, timeout: 40000})

      for(var i = 1; i < 3; i++) {
        let tagsToPush = []

        for (var j = 0; j < nbTags; j++) {
          let tag = tag_ids[faker.random.number(99)]
          if (tagsToPush.includes(tag) == false)
            tagsToPush.push(tag)
          else
            j--;
        }

        for (let index = 0; index < nbTags; index++) {
          try {
            sql = 'INSERT INTO user_tag (user_id, tag_id) \
                       VALUES (?, ?)'
            // console.log(users[i], tag_ids[index])
            await connection.query({sql, timeout: 40000, values: [i, tagsToPush[index].id]})

          } catch (error) {
            throw new Error('INSERT ' + i + ' failed in database/faker/UsersTagsFaker.createUserTags ' + error)
          }

        }

      }

    } catch (error) {
      throw new Error('SELECT failed in database/faker/UsersTagsFaker.createUserTags ' + error)
    }
  }


  static async createUserTags(users) {
      try {

      const nbTags = 5
      let sql = 'SELECT id FROM tags'

        const tag_ids = await connection.query({sql, timeout: 40000})

        for(var i = 3; i < users.length; i++) {
          let tagsToPush = []

          for (var j = 0; j < nbTags; j++) {
            let tag = tag_ids[faker.random.number(99)]
            if (tagsToPush.includes(tag) == false)
              tagsToPush.push(tag)
            else
              j--;
          }

          for (let index = 0; index < nbTags; index++) {
            try {
              sql = 'INSERT INTO user_tag (user_id, tag_id) \
                         VALUES (?, ?)'
              // console.log(users[i], tag_ids[index])
              await connection.query({sql, timeout: 40000, values: [i, tagsToPush[index].id]})

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
