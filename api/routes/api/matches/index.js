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

    let sql = 'SELECT matched_user.* FROM users \
    INNER JOIN user_tag AS current_user_tags ON current_user_tags.user_id = users.id \
    INNER JOIN user_tag AS matched_tags ON current_user_tags.tag_id = matched_tags.tag_id \
    INNER JOIN users AS matched_user ON matched_user.id = matched_tags.user_id \
    INNER JOIN profils AS current_user_profil ON current_user_profil.user_id = users.id \
    INNER JOIN profils AS matched_user_profil ON matched_user_profil.user_id = matched_user.id \
    LEFT JOIN likes ON (likes.liked_id = ?) \
      WHERE users.id = ? AND matched_user.id != ? \
      AND ( \
          CASE \
              WHEN current_user_profil.sexual_orientation = "bisexual" AND matched_user_profil.sexual_orientation = "bisexual" \
                  THEN matched_user_profil.gender IN ("female", "male") \
              WHEN current_user_profil.sexual_orientation = "bisexual" AND current_user_profil.gender = "female" \
                  THEN matched_user_profil.gender IN ("female", "male") AND matched_user_profil.sexual_orientation = "female" \
              WHEN current_user_profil.sexual_orientation = "bisexual" AND current_user_profil.gender = "male" \
                  THEN matched_user_profil.gender IN ("female", "male") AND matched_user_profil.sexual_orientation = "male" \
              WHEN current_user_profil.sexual_orientation = "female" AND current_user_profil.gender = "female" \
                  THEN matched_user_profil.gender = "female" AND matched_user_profil.sexual_orientation = "bisexual" \
              WHEN current_user_profil.sexual_orientation = "female" AND current_user_profil.gender = "female" \
                  THEN matched_user_profil.gender = "female" AND matched_user_profil.sexual_orientation = "female" \
              WHEN current_user_profil.sexual_orientation = "female" AND current_user_profil.gender = "male" \
                  THEN matched_user_profil.gender = "female" AND matched_user_profil.sexual_orientation = "male" \
              WHEN current_user_profil.sexual_orientation = "male" AND current_user_profil.gender = "female" \
                  THEN matched_user_profil.sexual_orientation = "female" AND matched_user_profil.gender = "male" \
              WHEN current_user_profil.sexual_orientation = "male" AND current_user_profil.gender = "male" \
                  THEN matched_user_profil.sexual_orientation = "male" AND matched_user_profil.gender = "male" \
              WHEN current_user_profil.sexual_orientation = "male" AND current_user_profil.gender = "male" \
                  THEN matched_user_profil.sexual_orientation = "bisexual" AND current_user_profil.gender = "male" \
          END) \
      GROUP BY matched_user.id \
      ORDER BY matched_user.id ASC'


    const possible_matches = await connection.query({
      sql,
      timeout: 40000,
      values: [e(check.id), e(check.id), e(check.id), e(check.id)]
    })


    if (!possible_matches) {
      res.json({
        'success': false,
        'message': 'Oops your location did not get updated try again'
      })
    }

    res.json({
      success: true,
      possible_matches: possible_matches
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
