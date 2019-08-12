const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Messages = require('../../../models/Messages')

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
        id
    } = req.body

    if (!(await Messages.delete(id, check.id))) {
        res.json({
            'success': false,
            'message': 'Oops your message did not delete try again.'
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
