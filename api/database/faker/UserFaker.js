const connection = require('../../middleware/database')

class UserFaker {

    static setRows() {
       var sql = 'INSERT IGNORE INTO users \
            (email, username, first_name, last_name, password, confirmed) \
            VALUES ( \
            "jlange@student.42.fr", \
            "jlange", \
            "Julien", \
            "Lange", \
            "$2a$10$9Rivpbj3vcLmffazlX3tduv/kdEHTMO.nAIQ.rgaNrY7ZOvDzr/Su", \
            1)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating user jlange ', err) })

        sql = 'INSERT IGNORE INTO users \
              (email, username, first_name, last_name, password, confirmed) \
              VALUES ( \
              "dadacruz@student.42.fr", \
              "dadacruz", \
              "David", \
              "Dacruz", \
              "$2a$10$P/NOnXMHCDA3A3oEzVs5QuNwO8t6NhKlUi.uLRS.vxiT3buoXOQhe", \
              1)'

          connection.query(sql, (err) => {if (err) console.log('Error while creating user dadacruz', err) })
    }

}

module.exports = UserFaker
