const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const Profil = require('../../../models/Profil')
const ratings = require('../../../helpers/ratings')
const {
  checkJWT
} = require('../../../middleware/check_token')


router.post('/', checkJWT, async (req, res) => {

  try {
    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
      if (err) return false
      return authData
    })

    if (!check || !req.body.liked_id) {
      res.json({
        'success': false,
        'message': 'Forbidden'
      })
      return (false);
    }
    // did the user already like this person ?
    const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_id = ?'

    await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(req.body.liked_id)]
    })

    await Profil.decreaseUserFameRating(req.body.liked_id, ratings.LIKES)

    res.json({
      success: true,
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
