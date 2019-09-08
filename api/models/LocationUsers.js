const connection = require('../middleware/database')
const e = require('escape-html')

class LocationUsers {

  static async getByUserId(userId) {
    try {
      const sql = 'SELECT DISTINCT * FROM location_users \
                  WHERE location_users.user_id = ?'


      const location = await connection.query({
          sql,
          timeout: 40000,
          values: [userId]
      })
      return location;
    } catch (error) {
        throw new Error('Select failed in model LocationUsers.getByUserId ' + error)
    }
  }

}

module.exports = LocationUsers
