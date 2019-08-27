const connection = require('../middleware/database')

class LoggedUser {

    static async get(userId) {
        try {
            const sql = 'SELECT DISTINCT * FROM logged_users WHERE user_id = ?'

            const result = await connection.query({sql, timeout: 40000, values: [userId]})
            if (result && !result.length)
                return null
            return result
          } catch (error) {
              throw new Error('SELECT failed in model LoggedUser.get ' + error)
          }
    }

    static async push(userId, socketId) {
        try {
            const sql = 'INSERT INTO logged_users (user_id, socket_id) VALUES (?,?)'

            const result = await connection.query({sql, timeout: 40000, values: [userId, socketId]})
            if (result && !result.length)
                return false
            return true
          } catch (error) {
              throw new Error('INSERT failed in model LoggedUser.push ' + error)
          }
    }

    static async remove(socketId) {
        try {
            const sql = 'DELETE FROM logged_users WHERE socket_id = ?'

            const result = await connection.query({sql, timeout: 40000, values: [socketId]})

            if (!result)
                return false
            return true
          } catch (error) {
              throw new Error('DELETE failed in model LoggedUser.remove ' + error)
          }
    }
}

module.exports = LoggedUser
