const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Message = require('../../../models/Message')
const Match = require('../../../models/Match')

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

  const {
      to,
      message
  } = req.body

  if (!(await Match.isMatch(check.id, to))) {
    res.json({
        'success': false,
        'message': 'Oops you did not match this person.'
    })
    return (false);
  }

  if (!(await Message.push(check.id, to, message))) {
      res.json({
          'success': false,
          'message': 'Oops your message did not send try again.'
      })
  }

  res.json({
    success: true,
  });
})

module.exports = router
