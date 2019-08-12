const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Messages = require('../../../models/Messages')
const Matchs = require('../../../models/Matchs')

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

    const {
        to,
        message
    } = req.body

    if (!(await Matchs.isMatch(check.id, to))) {
      res.json({
          'success': false,
          'message': 'Oops you did not match this person.'
      })
      return (false);
    }

    if (!(await Messages.push(check.id, to, message))) {
        res.json({
            'success': false,
            'message': 'Oops your message did not send try again.'
        })
    }

    res.json({
      success: true,
    });
  } catch (error) {
    throw new Error(' ' + error)
  }
})

module.exports = router
