const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const User = require('../../../models/User.js')
const Like = require('../../../models/Like.js')

// profil
router.post('/',
    async (req, res, next) => {
        try {

            const bearerHeader = req.headers['authorization']
            let json_token = null
            if (typeof bearerHeader !== 'undefined')
                json_token = bearerHeader.split(' ')[1]
            if (json_token) {       
                const check = jwt.verify(json_token, process.env.APP_KEY, (err, authData) => {
                    if (err) return false
                    return authData
                })
    
                if (!check) {
                    res.json({
                        'success': false,
                        'message': 'Forbidden'
                    })
                }
            
                const users = await User.getAllUsers(check.id);

                if (!users) {
                    return res.json({
                        'success': false,
                        'message': 'No users in database'
                    })
                }

                const likes = await Like.getMyLikes(check.id);

                res.json({
                    'success': true,
                    'users': users,
                    'likes': likes
                })
            
            } else {
                const users = await User.getAllUsers();

                if (!users) {
                    return res.json({
                        'success': false,
                        'message': 'No users in database'
                    })
                }

                res.json({
                    'success': true,
                    'users': users,
                })
            }

        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router
