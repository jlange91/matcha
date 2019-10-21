const connection = require('../config/database.js')
const faker = require('faker')

class TagsFaker {

  static async setUsers() {
    var tags = []
    for (var i = 0; i < 100; i++) {
      let tag = faker.random.words(2)
      if (tags.includes(tag) == false)
        tags.push(tag)
    }
    for (var i = 0; i < tags.length; i++) {
      try {
        let sql = 'INSERT INTO tags (name) \
                   VALUES (?)'
        await connection.query({sql, timeout: 40000, values: [tags[i]]})
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/TagsFaker.setUsers ' + error)
      }
    }
    }
  }

module.exports = TagsFaker
