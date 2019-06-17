const express = require('express')
const router = express.Router()
const User = require('../../../models/User')
const connection = require('../../../middleware/database')
const {
    check,
    validationResult
} = require('express-validator/check');

router.post('/', [
    check('email', 'Your email is not valid').trim().escape().not().isEmpty().isEmail().normalizeEmail(),
    check('password').trim().escape().isLength({ min: 6, max: 30 }).withMessage('Name must have more than 5 characters'),
    check('hash').not().isEmpty().trim().escape().withMessage('Missing hash') //.isLength({ min: 6, max: 30 }).withMessage('Password must have more than 6 or less than 30 characters'),
], async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                'success': false,
                'message': 'Missing params',
                'errors': [{'param': 'password', 'msg': 'Please make sure its long enough but not too long'}]
            })
        }

        let {
            email,
            hash,
            password
        } = req.body

        const sql = 'SELECT * FROM password_resets \
                    WHERE password_resets.email = ? \
                    AND password_resets.hash = ?'

        const result = await connection.query({
            sql,
            timeout: 40000,
            values: [email, hash]
        })

        if (result && !result.length) {
            return res.json({
                'success': false,
                'message': 'Your password reset link doesn\'t exist'
            })
        }

        await User.deletePasswordReset(email)

        const newPassword = User.updatePassword(email, password)

        if (!newPassword) {
            return res.json({
                'success': false,
                'message': 'Your password is not updated please try again'
            })
        }
      
        return res.json({
            'success': true,
            'message': 'You can log in with your new password'
        })

    } catch (err) {
        throw new Error('Error on user password reset ' + err)
    }
})


// send password reset mail
router.post('/check', [
    check('email', 'Your email is not valid').trim().escape().not().isEmpty().isEmail().normalizeEmail(),
    check('hash').not().isEmpty().trim().escape().withMessage('Missing hash') //.isLength({ min: 6, max: 30 }).withMessage('Password must have more than 6 or less than 30 characters'),
], async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                'success': false,
                'message': 'Missing params'
            })
        }

        let {
            email,
            hash
        } = req.body

        const sql = 'SELECT * FROM password_resets \
                    WHERE password_resets.email = ? \
                    AND password_resets.hash = ?'

        const result = await connection.query({
            sql,
            timeout: 40000,
            values: [email, hash]
        })

        if (result && !result.length) {
            return res.json({
                'success': false,
                'message': 'Your password reset link doesn\'t exist'
            })
        }

        return res.json({
            'success': true,
            'message': 'You can reset your password'
        })
    } catch (err) {
        throw new Error('Error on user password reset ' + err)
    }
})

module.exports = router