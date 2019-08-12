const connection = require('../middleware/database')
const User = require('./User')
const Matchs = require('./Matchs')
const e = require('escape-html')

class Notifications {

    static async exist(userId, focusId, type) {
      const sql = 'SELECT * FROM notifications WHERE (user_id = ? AND notified_id = ? AND type = ? AND seen = 0)'
      const ifExist = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId), e(focusId), e(type)]
      })

      return (ifExist && ifExist.length) ? true : false;
    }


    static async push(userId, focusId, type) {
      try {
        if (!(await Matchs.isMatch(userId, focusId)))
          return false;
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
        throw new Error('Push notifications failed Notifications.js ' + error)
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
          console.log(await User.getUsernameFromId(userId))
          return notifications
        } catch (error) {
            throw new Error('Get notifications failed Notifications.js ' + error)
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
            throw new Error('Remove notifications failed Notifications.js ' + error)
        }
    }
}

module.exports = Notifications
