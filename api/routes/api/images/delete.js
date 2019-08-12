const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const fs = require('fs')
const Images = require('../../../models/Images')
const User = require('../../../models/User')

const {
    checkJWT
} = require('../../../middleware/check_token')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.post('/', checkJWT, async (req, res) => {
    try {

        // http://localhost/api/v1/images/get/
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

        if (!(await Images.currentUserImage(check.id, req.body.image.substring(19))))
            return res.json({
                'success': false,
                'message': 'Forbidden'
            })

        await Images.delete(check.id, req.body.image.substring(19));

        const file = "/usr/src/api/assets/" + e(req.body.image.substring(19))

        if (fs.existsSync(file))
        {
          fs.unlinkSync(file)
          if (await User.isSameAvatar(check.id, req.body.image.substring(19)))
            await User.updateAvatar(check.id, "default.png");
        }

        return res.json({
            'success': true,
        })
    } catch (err) {
        throw new Error('Error on post image get' + err)
    }
})

module.exports = router
