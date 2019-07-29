const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const fs = require('fs')

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


        let sql = 'SELECT images.user_id FROM images \
                WHERE images.name = ?'

        let result = await connection.query({
            sql,
            timeout: 40000,
            values: [e(req.body.image.substring(19))]
        })

        if (!result || result[0].user_id != check.id)
            return res.json({
                'success': false,
                'message': 'Forbidden'
            })

        sql = 'DELETE FROM images \
              WHERE images.name = ? \
              AND images.user_id = ?'

        await connection.query({
            sql,
            timeout: 40000,
            values: [e(req.body.image.substring(19)), e(check.id)]
        })

        const file = "/usr/src/api/assets/" + e(req.body.image.substring(19))

        if (fs.existsSync(file))
            fs.unlinkSync(file)

            sql = 'SELECT * FROM users \
            WHERE users.id = ?'

            result = await connection.query({
                sql,
                timeout: 40000,
                values: [e(check.id)]
            })

            if (result && result[0].avatar == req.body.image.substring(19)) {
                sql = 'UPDATE users \
                SET users.avatar = ? \
                WHERE users.id = ?'

                await connection.query({
                    sql,
                    timeout: 40000,
                    values: ["default.png", e(check.id)]
                })
            }


        return res.json({
            'success': true,
        })
    } catch (err) {
        throw new Error('Error on post image get' + err)
    }
})

module.exports = router