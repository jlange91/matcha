const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const Tags = require('../../../models/Tags.js')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.get('/', async (req, res) => {

    try {

        res.json(await Tags.getAllTags())

    } catch (err) {
        throw new Error('Error on post user create ' + err)
    }
})

module.exports = router
