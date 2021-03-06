const connection = require('../config/database.js')

class UsersFaker {

    static async setAdmins() {
      try {
       var sql = 'INSERT IGNORE INTO users \
            (avatar, email, username, first_name, last_name, password, confirmed) \
            VALUES ( \
            "24eef96049084e24a22416565ec45c73.jpg", \
            "jlange@student.42.fr", \
            "jlange", \
            "Julien", \
            "Lange", \
            "$2a$10$rw3D78RWrsfmhGHvTsk..O59glkLSMH2GgM/.2e2ieM/bEemotai6", \
            1)'

        await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 1 failed in database/faker/UsersFaker.setAdmins ' + error)
      }
      try {
        sql = 'INSERT IGNORE INTO users \
              (avatar, email, username, first_name, last_name, password, confirmed) \
              VALUES ( \
              "d6d894d4853547a2ac1ec25029f0cc84.jpg", \
              "dadacruz@student.42.fr", \
              "dadacruz", \
              "David", \
              "Dacruz", \
              "$2a$10$rw3D78RWrsfmhGHvTsk..O59glkLSMH2GgM/.2e2ieM/bEemotai6", \
              1)'

        await connection.query(sql)
      } catch (error) {
        throw new Error('INSERT 2 failed in database/faker/UsersFaker.setAdmins ' + error)
      }
    }

    static async setUsers(users) {
      try {
        var sql;

        for (var i = 0; users[i]; i++) {
            sql = 'INSERT IGNORE INTO users \
                 (avatar, email, username, first_name, last_name, password, confirmed) \
                 VALUES ( \
                 "default.png", \
                 ?, \
                 ?, \
                 ?, \
                 ?, \
                 "$2a$10$rw3D78RWrsfmhGHvTsk..O59glkLSMH2GgM/.2e2ieM/bEemotai6", \
                 1)'

            await connection.query({
                  sql,
                  timeout: 40000,
                  values: [users[i].email, users[i].username, users[i].firstName, users[i].lastName]
            })
        }
      } catch (error) {
        throw new Error('INSERT failed in database/faker/UsersFaker.setUsers ' + error)
      }
    }

}

module.exports = UsersFaker
