const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Message = require('../../../models/Message')

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
      id
  } = req.body

  if (!(await Message.delete(id, check.id))) {
      res.json({
          'success': false,
          'message': 'Oops your message did not delete try again.'
      })
  }

  res.json({
    success: true,
  });
})

module.exports = router
