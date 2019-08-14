const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')


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

            sql = 'SELECT DISTINCT users.*, GROUP_CONCAT(tags.name) AS user_tags FROM users \
                    LEFT JOIN user_tag AS current_user_tags ON current_user_tags.user_id = users.id \
                    LEFT JOIN tags ON tags.id = current_user_tags.tag_id \
                    WHERE users.id != ? \
                    GROUP BY users.id'

            const users = await connection.query({
                sql,
                timeout: 40000,
                values: [e(check.id)]
            })


            if (!users) {
                res.json({
                    'success': false,
                    'message': 'No users in database'
                })
            }

            sql = 'SELECT likes.liked_id FROM likes WHERE likes.user_id = ?'

            const likes = await connection.query({
                sql,
                timeout: 40000,
                values: [e(check.id)]
            })


            res.json({
                'success': true,
                'users': users,
                'likes': likes
            })
        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router