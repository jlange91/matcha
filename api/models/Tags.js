const connection = require('../middleware/database')
const e = require('escape-html')

class Tags {

  static async getAllTags(userId, matchId) {
    const sql = 'SELECT * FROM tags'
    const tags = await connection.query({
        sql,
        timeout: 40000
    })
    return tags;
  }

}

module.exports = Tags
