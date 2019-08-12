const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const Notifications = require('../../../models/Notifications.js')
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

    const notifs = await Notifications.get(check.id);

    console.log(notifs);

    res.json({
      success: true,
      notifications: "lol"
    });
  } catch (error) {
    throw new Error('Notifications root error ' + error)
  }
})

module.exports = router
