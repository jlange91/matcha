const connection = require('../middleware/database')
const Match = require('./Match')
const e = require('escape-html')

class Notification {

    static async exist(userId, focusId, type) {
      try {
        const sql = 'SELECT * FROM notifications WHERE (user_id = ? AND notified_id = ? AND type = ? AND seen = 0)'
        const ifExist = await connection.query({
            sql,
            timeout: 40000,
            values: [e(userId), e(focusId), e(type)]
        })

        return (ifExist && ifExist.length) ? true : false;
      } catch (error) {
          throw new Error('SELECT failed in model Notification.exist ' + error)
      }
    }


    static async push(userId, focusId, type) {
      try {
        if (await this.exist(userId, focusId, type))
          return false;

        const sql = 'INSERT IGNORE INTO notifications(user_id, notified_id, type) VALUES (?,?,?)'
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
          throw new Error('INSERT failed in model Notification.push ' + error)
      }
    }

    static async get(userId) {
        try {
          const sql = 'SELECT n.id, u1.username AS "username1", u2.username AS "username2", n.type\
                      FROM notifications AS n \
                      INNER JOIN users AS u1 ON u1.id=n.user_id \
                      INNER JOIN users AS u2 ON u2.id=n.notified_id \
                      WHERE n.notified_id = ?;'
          const notifications = await connection.query({
              sql,
              timeout: 40000,
              values: [e(userId)]
          })
          return notifications
        } catch (error) {
            throw new Error('SELECT failed in model Notification.get ' + error)
        }
    }

    static async setSeen(id) {
        try {
            const sql = 'UPDATE notifications SET seen = 1 WHERE id = ?'

            const result = await connection.query({sql, timeout: 40000, values: [id]})
            if (!result)
                return false
            return true
          } catch (error) {
              throw new Error('UPDATE failed in model Notification.setSeen ' + error)
          }
    }

    static async remove(id) {
        try {
            const sql = 'DELETE FROM notifications WHERE id = ?'

            const result = await connection.query({sql, timeout: 40000, values: [id]})
            if (!result)
                return false
            return true
          } catch (error) {
              throw new Error('DELETE failed in model Notification.remove ' + error)
          }
    }
}

module.exports = Notification
