const connection = require('../../middleware/database')

class MatchFaker {

    static setRows() {
       const sql = 'INSERT IGNORE INTO matchs \
            (user_id, match_id) \
            VALUES ((SELECT id from users WHERE username = "jlange"), (SELECT id from users WHERE username = "dadacruz"))'

        connection.query(sql, (err) => {if (err) console.log('Error while insert match', err) })
    }

}

module.exports = MatchFaker
