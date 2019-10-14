const express = require('express')
const router = express.Router()
const Image = require('../../../models/Image')

router.get('/:id', async (req, res) => {
  console.log(req.params.id)
  return res.json({
      'success': true,
      'images': await Image.getUserImages(req.params.id)
    })
})

module.exports = router
