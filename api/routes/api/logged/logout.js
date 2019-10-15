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

    // let sql = 'DELETE FROM logged_users \
    //             WHERE logged_users.user_id = ?'
    //
    // await connection.query({
    //   sql,
    //   timeout: 40000,
    //   values: [e(check.id)]
    // })


      let sql = "UPDATE profils SET last_seen = ? WHERE profils.user_id = ?"
      let date = new Date()
      date.setHours(date.getHours() + 2)
      date.setMinutes(date.getMinutes() - 8)
      await connection.query({
        sql,
        timeout: 40000,
        values: [e(date.toISOString().slice(0, 19).replace('T', ' ')), e(check.id)]
      })

      return res.json({
        success: true,
      });


  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
