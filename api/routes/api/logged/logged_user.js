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

    let sql = 'SELECT DISTINCT * FROM logged_users \
    WHERE logged_users.user_id = ?'

    const user = await connection.query({
      sql,
      timeout: 40000,
      values: [e(req.body.user_id)]
    })
 
    if (!user.length) {
      sql = "SELECT DISTINCT last_seen FROM profils WHERE profils.user_id = ?"

      const is_logged = await connection.query({
        sql,
        timeout: 40000,
        values: [e(req.body.user_id)]
      })


console.log("last seen", last_seen)
      return res.json({
        success: true,
        is_logged: is_logged,
      });
    }

    return res.json({
      success: true,
      is_logged: { last_seen: true}
    });

  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
