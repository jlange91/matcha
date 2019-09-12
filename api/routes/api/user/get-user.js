const express = require('express')
const router = express.Router()
const e = require('escape-html')
const connection = require('../../../middleware/database')

// profil
router.get('/',
    async (req, res, next) => {
        try {
          console.log(req.route)
          console.log(req.params)
          console.log(req.query.username)
        } catch (error) {
            throw new Error('user delete ' + error)

        }

    })

module.exports = router
