const connection = require('../middleware/database')
const e = require('escape-html')

class View {

  static async getPeopleUsernameWhoViewedMe(id) {
    try {
      const sql = 'SELECT users.username FROM views \
      INNER JOIN users ON users.id = views.user_id \
      WHERE views.viewed_id = ?'
      const likes = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id)]
      })
      return likes;
    } catch (error) {
        throw new Error('SELECT failed in model View.getPeopleUsernameWhoViewedMe' + error)
    }
  }

}

module.exports = View
