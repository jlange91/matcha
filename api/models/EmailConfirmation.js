const connection = require('../middleware/database')
const e = require('escape-html')

class EmailConfirmation {

    static async find(email, hash) {
        try {
            const sql = 'SELECT DISTINCT * FROM email_confirmations \
                        WHERE email_confirmations.email = ? \
                        AND email_confirmations.hash = ?'

            const result = await connection.query({sql, timeout: 40000, values: [e(email), e(hash)]})
            if (result && !result.length)
                return false
            return true // result[0]
        } catch (error) {
            throw new Error('SELECT failed in model EmailConfimation.find ' + error)
        }
    }

    static async destroy(email) {
        try {
            const sql = 'DELETE FROM email_confirmations \
                         WHERE email = ?'

            const result = await connection.query({sql, timeout: 40000, values: [e(email)]})

            if (!result)
                return false
            return true
        } catch (error) {
            throw new Error('DELETE failed in model EmailConfimation.destroy ' + error)
        }
    }
}

module.exports = EmailConfirmation
