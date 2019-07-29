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
            
        
            let sql = 'SELECT images.user_id FROM images \
            WHERE images.name = ?'

            let result = await connection.query({
                          sql,
                          timeout: 40000,
                          values: [ e(req.body.image)]
                      })
            
            if (!result || result[0].user_id != check.id)
                return res.json({
                    'success': false,
                    'message': 'Forbidden'
                })            

            sql  = 'UPDATE users \
                    SET avatar = ? \
                    WHERE users.id = ?'
            
            result = await connection.query({
                    sql,
                    timeout: 40000,
                    values: [ e(req.body.image), e(check.id)]
                })
                
            if (!result)
              return res.json({
                'success': false,
                'message': 'Forbidden'
            })    

            return res.json({
                'success': true,
                //'message': `Oops your tag ${tag} did not get created`
            })
        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router