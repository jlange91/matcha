const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const Tag = require('../../../models/Tag.js')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.get('/', async (req, res) => {

    try {

        res.json(await Tag.getAllTags())

    } catch (err) {
        throw new Error('Error on post user create ' + err)
    }
})

module.exports = router
