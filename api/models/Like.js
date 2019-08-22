const connection = require('../middleware/database')
const e = require('escape-html')

class Like {

  static async getMatchedUsers(id) {
    try {
      const sql = 'SELECT u.id, u.username, u.avatar \
                  FROM users AS u \
                  INNER JOIN likes AS ilike ON (ilike.user_id = ?) \
                  INNER JOIN likes AS tlike ON (tlike.liked_id = ?) \
                  WHERE u.id = ilike.liked_id AND ilike.liked_id = tlike.user_id'
      const matchedUsers = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id), e(id)]
      })
      return matchedUsers;
    } catch (error) {
        throw new Error('SELECT failed in model Like.getMatchedUsers ' + error)
    }
  }

  static async getMyLikes(id) {
    try {
      const sql = 'SELECT likes.liked_id FROM likes WHERE likes.user_id = ?'
      const likes = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id)]
      })
      return likes;
    } catch (error) {
        throw new Error('SELECT failed in model Like.getMyLikes ' + error)
    }
  }

}

module.exports = Like
