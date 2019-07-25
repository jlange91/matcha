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
        focus_id,
        limit
    } = req.body

    sql = 'SELECT from_id, body, seen, DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") AS date \
            FROM messages \
            WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) \
            ORDER BY created_at DESC \
            LIMIT ?;'
    let messages = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(focus_id), e(focus_id), e(check.id), parseInt(e(limit))]
    })
    if (messages && !messages.length) {
        res.json({
          success: true,
          messages: null
        })
    }
    else
    {
      for (const [key, message] of Object.entries(messages)) {
        if (message.seen === 0)
        {
          sql = 'UPDATE messages \
          SET seen = 1\
          WHERE (from_id = ? AND to_id = ?)'
          const newMessage = await connection.query({
              sql,
              timeout: 40000,
              values: [e(focus_id), e(check.id)]
          })
        }
      }
      res.json({
        success: true,
        messages: messages
      });
    }
  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
