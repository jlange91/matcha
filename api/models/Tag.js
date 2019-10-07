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
          values: [e(tag)]
      })
      return newTag
    } catch (error) {
        throw new Error('INSERT failed in model Tag.push ' + error)
    }
  }

  static async getAllTags() {
    try {
      const sql = 'SELECT * FROM tags ORDER BY BINARY name'
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
            values: [e(name)]
        })
        return existingTag;
    } catch (error) {
        throw new Error('SELECT failed in model Tag.getByName ' + error)
    }
  }

}

module.exports = Tag
