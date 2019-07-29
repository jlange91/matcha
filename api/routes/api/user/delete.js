const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')


// profil
router.post('/', [
        checkJWT
    ],
    async (req, res, next) => {
        try {
         
            const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
                if (err) return false
                return authData
            })

            if (!check) {
                res.json({
                    'success': false,
                    'message': 'Forbidden'
                })
            }
            
        
            const sql = 'DELETE FROM users \
                        WHERE users.id = ?'

            const deleted = await connection.query({
                sql,
                timeout: 40000,
                values: [e(check.id)]
            })


            if (!deleted) {
                res.json({
                    'success': false,
                    'message': 'Oops your account did not get deleted try again'
                })
            }


            res.json({
                'success': true,
                //'message': `Oops your tag ${tag} did not get created`
            })
        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router