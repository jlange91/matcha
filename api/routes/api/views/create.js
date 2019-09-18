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

    // did the user already like this person ?
    let sql = 'SELECT * FROM views WHERE user_id = ? AND viewed_id = ?'

    const user_views = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(req.body.viewed_id)]
    })

    if (user_views.length) {
      sql = 'UPDATE views \
              SET count = ? \
              WHERE user_id = ? AND viewed_id = ?'

      await connection.query({
          sql,
          timeout: 40000,
          values: [user_views.count + 1, e(check.id), e(req.body.viewed_id)]
      })

      res.json({
        success: true,
      });
    }

    // if he doesnt already like the person save like into database
    sql = 'INSERT INTO views (user_id, viewed_id, count) VALUES (? ,?, ?)'

    const view = await connection.query({
      sql,
      timeout: 40000,
      values: [e(check.id), e(req.body.liked_id), 1]
    })


    if (!view) {
      res.json({
        'success': false,
        'message': 'Oops your view not get updated try again'
      })
    }

    res.json({
      success: true,
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
