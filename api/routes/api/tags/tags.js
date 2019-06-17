const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public 
router.get('/', async (req, res) => {

    try {

        let sql = 'SELECT * FROM tags'
       
        const tags = await connection.query({
            sql,
            timeout: 40000
        })

        res.json(tags)

    } catch (err) {
        throw new Error('Error on post user create ' + err)
    }
})

module.exports = router