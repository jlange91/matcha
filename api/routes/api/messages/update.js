const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')

router.post('/', checkJWT, async (req, res) => {

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
        return (false);
    }

    const {
        id,
        message
    } = req.body

    let sql = 'UPDATE messages \
    SET body = ?, created_at = CURRENT_TIMESTAMP\
    WHERE messages.id = ? AND messages.from_id = ?'
    const newMessage = await connection.query({
        sql,
        timeout: 40000,
        values: [e(message), e(id), e(check.id)]
    })

    if (!newMessage) {
        res.json({
            'success': false,
            'message': 'Oops your message did not update try again.'
        })
    }

    res.json({
      success: true,
    });
  } catch (error) {
    throw new Error(' ' + error)
  }
})

module.exports = router
