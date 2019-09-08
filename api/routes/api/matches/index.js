const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
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

    let sql = 'SELECT matched_user.*, matched_user_profil.*, GROUP_CONCAT(tags.name) AS user_tags, COUNT(tags.id) AS total_common_tags, SQRT(POWER(matched_user_location.lat - user_location.lat, 2) + POWER(matched_user_location.lng - user_location.lng, 2)) * 111.32 \
              AS distance \
              FROM users \
              INNER JOIN user_tag AS current_user_tags ON current_user_tags.user_id = users.id \
              INNER JOIN location_users AS user_location ON user_location.user_id = users.id \
              INNER JOIN user_tag AS matched_tags ON current_user_tags.tag_id = matched_tags.tag_id \
              INNER JOIN users AS matched_user ON matched_user.id = matched_tags.user_id \
              INNER JOIN profils AS current_user_profil ON current_user_profil.user_id = users.id \
              INNER JOIN profils AS matched_user_profil ON matched_user_profil.user_id = matched_user.id \
              INNER JOIN location_users AS matched_user_location ON matched_user_location.user_id = matched_user.id \
              INNER JOIN tags ON tags.id = matched_tags.tag_id \
              WHERE (users.id = ? AND matched_user.id != ?) \
                GROUP BY matched_user.id, users.id \
                ORDER BY distance ASC'


    const possible_matches = await connection.query({
      sql,
      timeout: 40000,
      values: [e(check.id), e(check.id)]
    })
    console.log("Possible matches", possible_matches)
    if (!possible_matches) {
      res.json({
        'success': false,
      })
    }

    sql = 'SELECT likes.liked_id FROM likes WHERE likes.user_id = ?'

    const likes = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id)]
    })

    res.json({
      success: true,
      possible_matches: possible_matches,
      user_likes: likes
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
