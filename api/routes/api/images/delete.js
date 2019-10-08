const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const fs = require('fs')
const Image = require('../../../models/Image')
const User = require('../../../models/User')
const Profil = require('../../../models/Profil')
const ratings = require('../../../helpers/ratings')

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

  if (!(await Image.currentUserImage(check.id, req.body.image.substring(19))))
      return res.json({
          'success': false,
          'message': 'Forbidden'
      })

  await Image.delete(check.id, req.body.image.substring(19));

  const file = "/usr/src/api/assets/" + e(req.body.image.substring(19))

  if (fs.existsSync(file))
  {
    fs.unlinkSync(file)
    if (await User.isSameAvatar(check.id, req.body.image.substring(19)))
      await User.updateAvatar(check.id, "default.png");
  }
  await Profil.decreaseUserFameRating(e(check.id), ratings.UPLOAD)
  return res.json({
      'success': true,
  })
})

module.exports = router
