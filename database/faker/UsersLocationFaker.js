const connection = require('../config/database.js')

class UsersLocationFaker {
  
  async setUserLocation(user_id) {
      try {
        // open csv
        // get a random lat and long
        let sql = 'INSERT INTO location_users (user_id, lat, lng) \
                   VALUES (?, ?, ?)'

        await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 1 failed in database/faker/UsersFaker.setAdmins ' + error)
      }
    }
}

module.exports = UsersLocationFaker
