const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../../models/User')
const bcrypt = require('bcryptjs');
const geoip = require('geoip-lite');
const { check, validationResult } = require('express-validator/check');
const passwordValidator = require('password-validator');
// login
router.post('/', [
  
    check('login').not().isEmpty().trim().escape().withMessage('Please provide your username or email'),
    check('password').trim().escape().isLength({ min: 6, max: 30 }).withMessage('Password must have more than 6 or less than 30 characters'),
    check('ip').not().isEmpty().trim().escape().withMessage('Missing ip'),
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

        const { login, password, ip } = req.body

        const {
            country,
            region,
            city,
            ll
        } = await geoip.lookup(ip)

        const user_location = {
            country,
            region,
            city,
            ll
        }

        let result = await User.findOneWithPassword(login, login)
        if (!result) {
            return res.json({
                'success': false,
                'message': 'Your email or username don\'t exist in our system'
            })
        }


        if (!result[0].confirmed) {
            return res.json({
                'success': false,
                'message': 'Please validate your account before you can log in'
            })
        }

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.json({
                    'success': false,
                    'message': 'Your credentials do not match'
                })
            }
            if (isMatch) {
                // create userLocation table
                let location = User.createUserLocation(result[0].id, user_location)

                if (!location) {
                    return res.json({
                        'success': false,
                        'message': 'Sorry we couldn\'t create your geo location'
                    })
                }
                jwt.sign({
                        'id': result[0].id,
                        'username': result[0].username,
                        'email': result[0].email,
                        'first_name': result[0].first_name,
                        'last_name': result[0].last_name
                    },
                    process.env.APP_KEY, {
                        expiresIn: '1d'
                    },
                    (err, token) => {
                        if (err) {
                            return res.json({
                                'success': false,
                                'message': 'Your token was not generated please try again'
                            })
                        }
                        let date = new Date();
                        date.setDate(date.getDate() + 1);
                        res.json({
                            'success': true,
                            'message': 'You are logged in',
                            'token': token,
                            'exp': date
                        })
                    })
            }
        })
    } catch (error) {
        throw new Error('Error on user login ' + error)
    }



})

module.exports = router