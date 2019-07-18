const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')


// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.get('/', checkJWT, async (req, res) => {

  try {
    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    sql = 'SELECT * FROM matchs WHERE user_id = ?'
    const matchs = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id)]
    })
    if (matchs && !matchs.length) {
        res.json({
            'success': false
        })
    }
    res.json({
        matchs: matchs,
    })
  } catch (error) {
    throw new Error('Profil update ' + error)
  }
})

module.exports = router
