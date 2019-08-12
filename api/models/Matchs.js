const connection = require('../middleware/database')
const e = require('escape-html')

class Matchs {

  static async isMatch(userId, matchId) {
      const sql = 'SELECT * FROM likes WHERE (user_id = ? AND liked_id = ?) OR (user_id = ? AND liked_id = ?)'
      const match = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId), e(matchId), e(matchId), e(userId)]
      })
      return (match && match.length == 2) ? true : false;
  }

}

module.exports = Matchs
