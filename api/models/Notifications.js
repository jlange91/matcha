const connection = require('../middleware/database')
const e = require('escape-html')

class Notifications {

    static async push(userId, focusId, type) {
      try {
        var sql = 'SELECT * FROM likes WHERE (user_id = ? AND liked_id = ?) OR (user_id = ? AND liked_id = ?)'
        const match = await connection.query({
            sql,
            timeout: 40000,
            values: [e(userId), e(focusId), e(focusId), e(userId)]
        })

        if (match && match.length != 2) {
          return false;
        }

        sql = 'SELECT * FROM notifications WHERE (user_id = ? AND notified_id = ? AND type = ? AND seen = 0)'
        const ifExist = await connection.query({
            sql,
            timeout: 40000,
            values: [e(userId), e(focusId), e(type)]
        })

        if (ifExist && ifExist.length) {
          return false;
        }

        sql = 'INSERT IGNORE INTO notifications(user_id, notified_id, type) VALUES (?,?,?)'
        const newNotification = await connection.query({
            sql,
            timeout: 40000,
            values: [e(userId), e(focusId), e(type)]
        })

        if (!newNotification) {
          return false;
        }
        return true
      } catch (error) {
        throw new Error(' ' + error)
      }
    }

    // static async get(userId, socketId) {
    //     try {
    //         const sql = 'INSERT INTO logged_users (user_id, socket_id) VALUES (?,?)'
    //
    //         const result = await connection.query({sql, timeout: 40000, values: [userId, socketId]})
    //         if (result && !result.length)
    //             return false
    //         return true
    //     } catch (error) {
    //         throw new Error('Push notifications failed Notifications.js ' + error)
    //     }
    // }
    //
    // static async remove(socketId) {
    // }
}

module.exports = Notifications
