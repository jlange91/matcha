const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const jwt = require('jsonwebtoken')
const Images = require('../../../models/Images')

const {
    checkJWT
} = require('../../../middleware/check_token')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.post('/', checkJWT, async (req, res) => {
  try {

    // http://localhost/api/v1/images/get/
    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    if (!check) {
        return res.json({
            'success': false,
            'message': 'Forbidden'
        })

    }
    return res.json({
        'success': true,
        'images': await Images.getUserImages(check.id)
      })

  } catch(err) {
    throw new Error('Error on post image get' + err)
      }
})

module.exports = router
