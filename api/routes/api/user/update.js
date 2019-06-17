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
        check('same_email')
        .not().isEmpty().trim().escape()
        .isIn(['true', 'false']),
                check('user.email', 'Your email is not valid').trim().escape().not().isEmpty().isEmail().normalizeEmail(),
    check('user.username').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Name must have more than 5 characters'),
    check('user.first_name').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Name must have more than 5 characters'),
    check('user.last_name').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Name must have more than 5 characters'),
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
                same_email,
                user
            } = req.body
            
            const confirmed = same_email ? true : false;

            const sql = 'UPDATE users \
            SET email = ?, username = ?, first_name = ?, last_name = ?, confirmed = ?\
            WHERE users.id = ?'

            const newUser = await connection.query({
                sql,
                timeout: 40000,
                values: [user.email, user.username, user.first_name, user.last_name, confirmed, e(check.id)]
            })


            if (!newUser) {
                res.json({
                    'success': false,
                    'message': 'Oops your profil did not get updated try again'
                })
            }

            let sendMail = true

            if (!same_email)
                sendMail = await User.sendEmailConfirmation(e(check.id), user.email);
                
            if (!sendMail) {
                res.json({
                    'success': false,
                    'message': 'Oops your profil did not get updated try again'
                })
            }

            res.json({
                'success': true,
                'loggedIn': confirmed
                //'message': `Oops your tag ${tag} did not get created`
            })
        } catch (error) {
            throw new Error('Profil update ' + error)

        }

    })

module.exports = router