const connection = require('../../middleware/database')

class UserFaker {

    static setRows() {
       var sql = 'INSERT IGNORE INTO users \
            (avatar, email, username, first_name, last_name, password, confirmed) \
            VALUES ( \
            "24eef96049084e24a22416565ec45c73.jpg", \
            "jlange@student.42.fr", \
            "jlange", \
            "Julien", \
            "Lange", \
            "$2a$10$9Rivpbj3vcLmffazlX3tduv/kdEHTMO.nAIQ.rgaNrY7ZOvDzr/Su", \
            1)'

        connection.query(sql, (err) => {if (err) console.log('Error while insert user jlange ', err) })

        sql = 'INSERT IGNORE INTO users \
              (avatar, email, username, first_name, last_name, password, confirmed) \
              VALUES ( \
              "8e05472833c74fc3bb1825b3d5364482.jpg", \
              "dadacruz@student.42.fr", \
              "dadacruz", \
              "David", \
              "Dacruz", \
              "$2a$10$P/NOnXMHCDA3A3oEzVs5QuNwO8t6NhKlUi.uLRS.vxiT3buoXOQhe", \
              1)'

          connection.query(sql, (err) => {if (err) console.log('Error while insert user dadacruz', err) })
    }

}

module.exports = UserFaker
