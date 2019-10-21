const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const Notification = require('../../../models/Notification.js')
const {
    checkJWT
} = require('../../../middleware/check_token')

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
      notificationId,
  } = req.body

  await Notification.remove(notificationId);

  res.json({
    success: true,
  });
})

module.exports = router
