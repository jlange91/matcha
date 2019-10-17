const connection = require('../config/database.js')
const csv = require('csv-parser')
const fs = require('fs')


class UsersLocationFaker {

  static async setAdminLocation() {
    var sql;
    var adminUsername = [
      'jlange',
      'dadacruz'
    ]

    for (var i = 0; i < 2; i++) {
      try {
        // open csv
        const results = [];
        const fd = fs.createReadStream('./database/locations/seeds_fr.csv')
        const end = new Promise(function(resolve, reject) {
          fd.pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve());
        });
        await end;
        // get a random lat and long
        let rand = results[Math.floor(Math.random() * results.length)];

        sql = 'INSERT INTO location_users (user_id, lat, lng, geo) \
                   VALUES ((SELECT id from users WHERE username = ?), ?, ?, ?)'

        await connection.query({sql, timeout: 40000, values: [adminUsername[i], rand.lat, rand.lng, rand.country]})
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/UsersLocationFaker.setUsersLocation ' + error)
      }
    }
  }

  static async setUsersLocation(users) {
    var sql;

    for (var i = 0; users[i]; i++) {
      try {
        // open csv
        const results = [];
        const fd = fs.createReadStream('./database/locations/seeds_fr.csv')
        const end = new Promise(function(resolve, reject) {
          fd.pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve());
        });
        await end;
        // get a random lat and long
        let rand = results[Math.floor(Math.random() * results.length)];

        sql = 'INSERT INTO location_users (user_id, lat, lng, geo) \
                   VALUES ((SELECT id from users WHERE username = ?), ?, ?, ?)'

        await connection.query({sql, timeout: 40000, values: [users[i].username, rand.lat, rand.lng, rand.country]})
      } catch (error) {
        throw new Error('INSERT ' + i + ' failed in database/faker/UsersLocationFaker.setUsersLocation ' + error)
      }
    }
  }
}

module.exports = UsersLocationFaker
