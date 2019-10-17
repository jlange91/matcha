const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
  checkJWT
} = require('../../../middleware/check_token')
const Match = require('../../../models/Match')
const Like = require('../../../models/Like.js')

router.post('/', checkJWT, async (req, res) => {

  try {

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

    const possible_matches = await Match.getAllMatch(check.id)

    if (!possible_matches) {
      return res.json({
        success: false
      })
    }

    const likes = await Like.getMyLikes(check.id);

    return res.json({
      success: true,
      possible_matches: possible_matches,
      user_likes: likes
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
