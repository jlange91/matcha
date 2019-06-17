const express = require('express')
const router = express.Router()
const User = require('../../../models/User')
const { check, validationResult } = require('express-validator/check');

// @route POST api/version/users/create
// @desc  Register a new user
// @access Public 
router.post('/', [
    check('email', 'Your email is not valid').trim().escape().not().isEmpty().isEmail().normalizeEmail(),
    check('password').trim().escape().isLength({ min: 6, max: 30 }).withMessage('Name must have more than 5 characters'),
    check('username').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Name must have more than 5 characters'),
    check('first_name').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Name must have more than 5 characters'),
    check('last_name').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Name must have more than 5 characters'),
    //check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password))
], async (req, res) => {

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

        const cleanUser = {
            username,
            email,
            password,
            first_name,
            last_name
        } = req.body

        let result = await User.create(cleanUser)
        
        res.json(result)

    } catch (err) {
        throw new Error('Error on post user create ' + err)
    }
})

module.exports = router