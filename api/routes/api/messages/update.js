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
      return res.json({
          'success': false,
          'message': 'Forbidden'
      })
  }

  const {
      id,
      message
  } = req.body

  if (!(await Message.update(id, message check.id))) {
        return res.json({
            'success': false,
            'message': 'Oops your message did not update try again.'
        })
  }

  res.json({
    success: true,
  });
})

module.exports = router
