const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
// profil
router.post('/', checkJWT, async (req, res) => {

    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    if (!check) {
        res.json({
            'success': false,
            'message': 'Forbidden'
        })
        return (false);
    }
    let sql = 'SELECT DISTINCT * FROM profils \
                        WHERE profils.user_id = ?'

    const profil = await connection.query({
        sql,
        timeout: 40000,
        values: [check.id]
    })
    if (profil && !profil.length) {
        res.json({
            'success': false
        })
    }

    sql = 'SELECT DISTINCT * FROM users \
                        WHERE users.id = ?'

    const user = await connection.query({
        sql,
        timeout: 40000,
        values: [check.id]
    })
    console.log(check);
    if (user && !user.length) {
        res.json({
            'success': false
        })
    }

    sql = 'SELECT DISTINCT * FROM location_users \
    WHERE location_users.user_id = ?'
    const location = await connection.query({
        sql,
        timeout: 40000,
        values: [check.id]
    })
    if (location && !location.length) {
        res.json({
            'success': false
        })
    }

    sql = 'SELECT tags.id, tags.name FROM tags \
           JOIN user_tag WHERE user_tag.user_id = ? \
           AND user_tag.tag_id = tags.id'

    const user_tags = await connection.query({
        sql,
        timeout: 40000,
        values: [check.id]
    })

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
