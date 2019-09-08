const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Profil = require('../../../models/Profil.js')
const UserTag = require('../../../models/UserTag.js')
const LocationUsers = require('../../../models/LocationUsers.js')
const User = require('../../../models/User.js')

// profil
router.post('/', checkJWT, async (req, res) => {

    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    if (!check) {
        return res.json({
            'success': false,
            'message': 'Forbidden'
        })
    }

    const profil = await Profil.getByUserId(check.id)
    if (profil && !profil.length) {
        return res.json({
            'success': false
        })
    }

    const user = await User.getById(check.id)
    if (user && !user.length) {
        return res.json({
            'success': false
        })
    }

    const location = await LocationUsers.getByUserId(check.id)
    const user_tags = await UserTag.getByUserId(check.id)

    res.json({
        success: true,
        authData: check,
        user: user[0],
        profil: profil[0],
        location: location[0],
        tags: user_tags
    })
})

module.exports = router
