const connection = require('../../middleware/database')

class MatchFaker {

    static setRows() {
       const sql = 'INSERT IGNORE INTO matchs \
            (user_id, match_id) \
            VALUES (1, 2)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating user jlange ', err) })
    }

}

module.exports = MatchFaker
