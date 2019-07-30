const connection = require('../../middleware/database')

class UserProfilFaker {

    static setRows() {
       var sql = 'INSERT IGNORE INTO profils \
                  (user_id, birthdate, gender, sexual_orientation, biography, completed)\
                  VALUES ( \
                  (SELECT id from users WHERE username = "jlange"), \
                  "1997/06/10", \
                  "male", \
                  "female", \
                  "Creator.", \
                  1)'

        connection.query(sql, (err) => {if (err) console.log('Error while insert jlange profil', err) })

        sql = 'INSERT IGNORE INTO profils \
              (user_id, birthdate, gender, sexual_orientation, biography, completed)\
              VALUES ( \
              (SELECT id from users WHERE username = "dadacruz"), \
              "1988/04/22", \
              "male", \
              "female", \
              "Creator.", \
              1)'

          connection.query(sql, (err) => {if (err) console.log('Error while insert dadacruz profil', err) })
    }

}

module.exports = UserProfilFaker
