const connection = require('../middleware/database')

class LoggedUsers {

    static async get(userId) {
        try {
            const sql = 'SELECT DISTINCT * FROM logged_users WHERE user_id = ?'

            const result = await connection.query({sql, timeout: 40000, values: [userId]})
            if (result && !result.length)
                return null
            return result[0]
        } catch (error) {
            throw new Error('Get logged users failed LoggedUsers.js ' + error)
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
            throw new Error('Push logged users failed LoggedUsers.js ' + error)
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
            throw new Error('Remove logged users failed LoggedUsers.js ' + error)
        }
    }
}

module.exports = LoggedUsers
