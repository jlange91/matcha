const express = require('express')
const router = express.Router()
const e = require('escape-html')
const Profil = require('../../../models/Profil.js')
const UserTag = require('../../../models/UserTag.js')
const LocationUsers = require('../../../models/LocationUsers.js')
const User = require('../../../models/User.js')
// profil
router.post('/',
    async (req, res, next) => {
        try {
            const username = e(req.body.username)

            const user = await User.getByUsername(username)
            console.log(user)
            if (user && !user.length) {
                return res.json({
                    'success': false
                })
            }
            const user_tags = await UserTag.getByUserId(user[0].id)
            res.json({
                success: true,
                user: {
                    user_info: user[0],
                    tags: user_tags
                }
            })

        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router
