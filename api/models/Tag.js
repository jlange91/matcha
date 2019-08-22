const connection = require('../middleware/database')
const e = require('escape-html')

class Tag {

  static async push(tag) {
    try {
      const sql = 'INSERT INTO tags \
             (name) VALUES (?)'
      const newTag = await connection.query({
          sql,
          timeout: 40000,
          values: [tag]
      })
      return newTag
    } catch (error) {
        throw new Error('INSERT failed in model Tag.push ' + error)
    }
  }

  static async getAllTags(userId, matchId) {
    try {
      const sql = 'SELECT * FROM tags'
      const tags = await connection.query({
          sql,
          timeout: 40000
      })
      return tags;
    } catch (error) {
        throw new Error('SELECT failed in model Tag.getAllTag ' + error)
    }
  }

  static async getByName(name) {
    try {
        const sql = 'SELECT * FROM tags WHERE name = ?'

        let existingTag = []

        existingTag = await connection.query({
            sql,
            timeout: 40000,
            values: [name]
        })
        return existingTag;
    } catch (error) {
        throw new Error('SELECT failed in model Tag.getByName ' + error)
    }
  }

}

module.exports = Tag
