const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const Views = require('../../../models/View')

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

    const users = await Views.getPeopleUsernameWhoViewedMe(e(check.id))

    if (!users)
      return res.json({
          'success': false,
          'message': 'You have no views'
        })

    return res.json({
          'success': true,
          'user_views': users
        })



  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
