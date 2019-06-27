const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const file = "/usr/src/api/assets/" + req.param("id")

    if (fs.existsSync(file))
      res.sendFile(file)
    else
      res.json({
          'success': false,
          'message': 'Image not found.'
      })
  } catch(err) {
    throw new Error('Error on post image get' + err)
      }
})

module.exports = router
