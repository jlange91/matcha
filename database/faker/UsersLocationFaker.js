const connection = require('../config/database.js')
const csv = require('csv-parser')
const fs = require('fs')

 
class UsersLocationFaker {
  
  static async setUserLocation(user_id) {
      try {
        // open csv
        const results = [];
        fs.createReadStream('../locations/seeds_fr.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          console.log(results);
          // [
          //   { NAME: 'Daffy Duck', AGE: '24' },
          //   { NAME: 'Bugs Bunny', AGE: '22' }
          // ]
        });
        // get a random lat and long
        console.log(results)
        let rand = results[Math.floor(Math.random() * results.length)];

        console.log(rand)
        let sql = 'INSERT INTO location_users (user_id, lat, lng) \
                   VALUES (?, ?, ?)'

        // await connection.query({sql, timeout: 40000, values: [user_id, lat, lng]})
      } catch (error) {
        throw new Error('INSERT 1 failed in database/faker/UsersFaker.setAdmins ' + error)
      }
    }
}

module.exports = UsersLocationFaker
