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
    check('password').trim().escape().isLength({ min: 6, max: 30 }).withMessage('Password must have more than 5 characters')
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
                password
            } = req.body
            
           const newPassword = User.updatePassword(check.email, password)

            if (!newPassword) {
                res.json({
                    'success': false,
                    'message': 'Oops your profil did not get updated try again'
                })
            }

            res.json({
                'success': true,
                'message': `Your password is updated`
            })
        } catch (error) {
            throw new Error('Profil update ' + error)

        }

    })

module.exports = router