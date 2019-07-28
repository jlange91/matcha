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
        to,
        message
    } = req.body

    sql = 'SELECT * FROM matchs WHERE (user_id = ? AND match_id = ?) OR (user_id = ? AND match_id = ?)'
    const match = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(to), e(to), e(check.id)]
    })

    if (match && !match.length) {
      res.json({
          'success': false,
          'message': 'Oops you did not match this person.'
      })
      return (false);
    }

    sql = 'INSERT INTO messages(from_id, to_id, body, seen) VALUES (?,?,?,?)'
    const newMessage = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(to), e(message), 0]
    })

    if (!newMessage) {
        res.json({
            'success': false,
            'message': 'Oops your message did not send try again.'
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
