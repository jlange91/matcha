const express = require('express')
const router = express.Router()
const e = require('escape-html')
const Profil = require('../../../models/Profil.js')
const UserTag = require('../../../models/UserTag.js')
const LocationUsers = require('../../../models/LocationUsers.js')
const User = require('../../../models/User.js')
const mimelib = require("mimelib");
// profil
router.get('/:user',
    async (req, res, next) => {
        try {

            const username = mimelib.decodeQuotedPrintable(e(req.params.user))
            // probleme avec les accent !!!
            console.log(username)
            if (username) {
                const user = await User.getByUsername(username)
               
                if (user && !user.length) {
                    return res.json({
                        'success': false
                    })
                }

                console.log(user[0].id)
                const user_tags = await UserTag.getByUserId(user[0].id)
                
                console.log(user_tags)
                
                res.json({
                    success: true,
                    user: {
                        user_info: user[0],
                        tags: user_tags
                    }
                })
            } else {
                return res.json({
                    'success': false
                })
            }

        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router
