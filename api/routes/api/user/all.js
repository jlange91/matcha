const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const User = require('../../../models/User.js')
const Like = require('../../../models/Like.js')

// profil
router.post('/', [
    checkJWT
],
    async (req, res, next) => {
        try {

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

            const users = await User.getAllUsers(check.id);

            if (!users) {
                return res.json({
                    'success': false,
                    'message': 'No users in database'
                })
            }

            const likes = await Like.getMyLikes(check.id);

            return res.json({
                'success': true,
                'users': users,
                'likes': likes
            })
        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router
