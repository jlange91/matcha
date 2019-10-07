const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const {
    check,
    validationResult
} = require('express-validator/check');
const User = require('../../../models/User')


// profil
router.post('/', [
        checkJWT,
        check('location')
        .not().isEmpty(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const error_response = {
                    'success': false,
                    'message': 'Please validate your inputs',
                    'errors': errors.array()
                }
                return res.json(error_response)
            }

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

            const {
                location,
            } = req.body
            
            const lat = e(location[0])
            const lng = e(location[1])
            const ll = [lat, lng]
            const updatedLocation = JSON.stringify({ll})
           
            const sql = 'UPDATE location_users \
            SET geo = ?, lat = ?, lng = ?, provided = 1\
            WHERE location_users.user_id = ?'

            const updated = await connection.query({
                sql,
                timeout: 40000,
                values: [e(updatedLocation), e(lat), e(lng), e(check.id)]
            })


            if (!updated) {
                res.json({
                    'success': false,
                    'message': 'Oops your location did not get updated try again'
                })
            }


            res.json({
                'success': true,
                //'message': `Oops your tag ${tag} did not get created`
            })
        } catch (error) {
            throw new Error('Profil update ' + error)

        }

    })

module.exports = router