const connection = require('../config/database.js')
const faker = require('faker')

class TagsFaker {

  static async createTags() {
    for (var i = 0; i < 100; i++) {
      try {
        let sql = 'INSERT INTO tags (name) \
                   VALUES (?)'
        await connection.query({sql, timeout: 40000, values: [faker.random.words(2)]})
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/UsersLocationFaker.setUsersLocation ' + error)
      }
    }
    }
  }

module.exports = TagsFaker