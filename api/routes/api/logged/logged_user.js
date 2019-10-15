const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
  checkJWT
} = require('../../../middleware/check_token')
const LoggedUser = require('../../../models/LoggedUser.js')
const Profil = require('../../../models/Profil.js')

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

    const user = await LoggedUser.get(req.body.user_id)

    if (!user.length) {
      const is_logged = await Profil.getLastSeen(req.body.user_id)

      return res.json({
        success: true,
        is_logged: is_logged[0],
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
