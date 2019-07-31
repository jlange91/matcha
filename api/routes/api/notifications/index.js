const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
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
    sql = 'SELECT * FROM notifications WHERE notified_id = ?'
    const notifications = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id)]
    })
    if (notifications && !notifications.length) {
        res.json({
            'success': false
        })
        return (false);
    }
    var retNotifications = {};
    notifications.forEach( (notification) => {
    })
    res.json({
      success: true,
      notifications: retNotifications
    });
  } catch (error) {
    throw new Error('Notifications root error ' + error)
  }
})

module.exports = router
