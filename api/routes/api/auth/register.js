const express = require('express')
const router = express.Router()
const User = require('../../../models/User')
const { check, validationResult } = require('express-validator/check');
const passwordValidator = require('password-validator');

// @route POST api/version/users/create
// @desc  Register a new user
// @access Public 
router.post('/', [
    check('email', 'Your email is not valid').trim().escape().not().isEmpty().isEmail().normalizeEmail(),
    check('password').trim().escape().isLength({ min: 6, max: 30 }).withMessage('Password must have more than 5 characters Password must have more than 5 characters and one number' ),
    check('username').trim().escape().isLength({ min: 5, max: 30 }).withMessage('User Name must have more than 5 characters'),
    check('first_name').trim().escape().isLength({ min: 5, max: 30 }).withMessage('First Name must have more than 5 characters'),
    check('last_name').trim().escape().isLength({ min: 5, max: 30 }).withMessage('Last Name must have more than 5 characters'),
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

        const schema = new passwordValidator();

        schema
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits()                                 // Must have digits

        if(!schema.validate(req.body.password)) 
            return res.json({
                'success': false,
                'message': 'Password is too weak'
            })
          

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