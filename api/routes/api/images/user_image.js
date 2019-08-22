const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const jwt = require('jsonwebtoken')
const Image = require('../../../models/Image')

const {
    checkJWT
} = require('../../../middleware/check_token')

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
  return res.json({
      'success': true,
      'images': await Image.getUserImages(check.id)
    })
})

module.exports = router
