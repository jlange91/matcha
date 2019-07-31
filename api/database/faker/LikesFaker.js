const connection = require('../../middleware/database')

class LikesFaker {

    static setRows() {
       var sql = 'INSERT IGNORE INTO likes \
            (user_id, liked_id) \
            VALUES ((SELECT id from users WHERE username = "jlange"), (SELECT id from users WHERE username = "dadacruz"))'

        connection.query(sql, (err) => {if (err) console.log('Error while insert match', err) })

        sql = 'INSERT IGNORE INTO likes \
             (user_id, liked_id) \
             VALUES ((SELECT id from users WHERE username = "dadacruz"), (SELECT id from users WHERE username = "jlange"))'

         connection.query(sql, (err) => {if (err) console.log('Error while insert match', err) })
    }

}

module.exports = LikesFaker
