const express = require('express')
const router = express.Router()
const EmailConfirmation = require('../../../models/EmailConfirmation')
const User = require('../../../models/User')
const { check, validationResult } = require('express-validator/check');

// @route POST api/version/users/confirmation
// @desc  Confirm user account
// @access Public 
router.post('/', [
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
    
        const emailConfirmation = await EmailConfirmation.find(email, hash)

        if (!emailConfirmation) {
            return res.json({
                'success': false,
                'message': 'Error on find user email confirmation'
            })
        }
        
        const userValidateAccount = await User.confirmAccount(email)
        
        if (!userValidateAccount) {
            return res.json({
                'success': false,
                'message': 'Error on validating your account'
            })
        }

        await EmailConfirmation.destroy(email)

        return res.json({
            'success': true,
            'message': 'Your account is confirmed, you can log in'
        })
    } catch (err) {
        throw new Error('Error on user account confirmation ' + err)
    }
})

module.exports = router