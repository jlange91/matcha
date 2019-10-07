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

    if (!check) {
      res.json({
        'success': false,
        'message': 'Forbidden'
      })
      return (false);
    }

    // CHECK IF THE USER HAS A PROFILE PIC 

    // did the user already like this person ?
    let sql = 'SELECT * FROM likes WHERE user_id = ? AND liked_id = ?'

    const user_likes = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(req.body.liked_id)]
    })

    if (user_likes.length)
      return res.json({
          'success': false,
          'message': 'You already like this user'
        })

    // if he doesnt already like the person save like into database
    sql = 'INSERT INTO likes (user_id, liked_id) VALUES (? ,?)'

    const like = await connection.query({
      sql,
      timeout: 40000,
      values: [e(check.id), e(req.body.liked_id)]
    })


    if (!like) {
      res.json({
        'success': false,
        'message': 'Oops your like did not get updated try again'
      })
    }
    
    await Profil.increaseUserFameRating(req.body.liked_id, ratings.LIKES)

    res.json({
      success: true,
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
