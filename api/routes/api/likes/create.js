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

    let sql = ''


    const like = await connection.query({
      sql,
      timeout: 40000,
      values: [e(check.id), e(check.id)]
    })


    if (like) {
      res.json({
        'success': false,
        'message': 'Oops your location did not get updated try again'
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
