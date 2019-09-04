const connection = require('../config/database.js')

class UserProfilFaker {

    static async setAdmins() {
      try {
       var sql = 'INSERT IGNORE INTO profils \
                  (user_id, birthdate, gender, sexual_orientation, biography, completed)\
                  VALUES ( \
                  (SELECT id from users WHERE username = "jlange"), \
                  "1997/06/10", \
                  "male", \
                  "female", \
                  "Creator.", \
                  1)'

        await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 1 failed in database/faker/UserProfilFaker.setAdmins ' + error)
      }
      try {
        sql = 'INSERT IGNORE INTO profils \
              (user_id, birthdate, gender, sexual_orientation, biography, completed)\
              VALUES ( \
              (SELECT id from users WHERE username = "dadacruz"), \
              "1988/04/22", \
              "male", \
              "female", \
              "Creator.", \
              1)'

        await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 2 failed in database/faker/UserProfilFaker.setAdmins ' + error)
      }
    }

    static async setUsers(users) {
      try {
        var sql;

        for (var i = 0; users[i]; i++) {
            sql = 'INSERT IGNORE INTO profils \
                  (user_id, birthdate, gender, sexual_orientation, biography, completed)\
                  VALUES ( \
                  (SELECT id from users WHERE username = ?), \
                  ?, \
                  ?, \
                  ?, \
                  ?, \
                  1)'

            await connection.query({
                  sql,
                  timeout: 40000,
                  values: [users[i].username, users[i].birthdate, users[i].gender, users[i].sexual_orientation, users[i].biography]
            })
        }
      } catch (error) {
        throw new Error('INSERT failed in database/faker/UserProfilFaker.setUsers ' + error)
      }
    }

}

module.exports = UserProfilFaker
