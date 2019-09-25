const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const Likes = require('../../../models/Like')
const User = require('../../../models/User')
const {
  checkJWT
} = require('../../../middleware/check_token')


router.get('/', checkJWT, async (req, res) => {

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

    const user_likes = await Likes.getMyLikes(check.id)
 
    if (!user_likes)
      return res.json({
          'success': false,
          'message': 'You have no likes'
        })
    
   
   

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
