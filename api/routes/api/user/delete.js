const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const User = require('../../../models/User.js')

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

            const deleted = await User.delete(check.id)


            if (!deleted)
                return res.json({
                    'success': false,
                    'message': 'Oops your account did not get deleted try again'
                })


            res.json({
                'success': true,
                //'message': `Oops your tag ${tag} did not get created`
            })
        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router
