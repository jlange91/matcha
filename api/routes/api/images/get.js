const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/:id', async (req, res) => {
  try {
    const file = "/usr/src/api/assets/" + req.params.id

    if (fs.existsSync(file))
      res.sendFile(file)
    else
      res.json({
          'success': false,
          'message': 'Image not found.'
      })
  } catch(err) {
    throw new Error('Error on image get' + err)
      }
})

module.exports = router
