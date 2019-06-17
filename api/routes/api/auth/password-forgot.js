const express = require('express')
const router = express.Router()
const User = require('../../../models/User')
const { check, validationResult } = require('express-validator/check');

// send password reset mail
router.post('/', [
    check('email', 'Your email is not valid').trim().escape().not().isEmpty().isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                'success': false,
                'message': 'Invalid or missing email',
                'errors': errors.array()
            })
        }

        let {
            email
        } = req.body

        const found = await User.findOne(email, email)

        if (!found) {
            return res.json({
                'success': false,
                'message': 'The email provided has no account',
                'errors': [{'param': 'email', 'msg': 'The email provided has no account'}]
            })
        }

        const passwordReset = await User.passwordReset(found)

        if (!passwordReset) {
            return res.json({
                'success': false,
                'message': 'The password reset failed try again'
            })
        }

        return res.json({
            'success': true,
            'message': 'Please check your inbox to reset your password'
        })

    } catch (error) {
        throw new Error('Error on password forgot ' + error)
    }
})

module.exports = router