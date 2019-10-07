const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const formidable = require('formidable')
const path = require('path')
const uuidv4 = require('uuid/v4');
const Image = require('../../../models/Image')


const {
    checkJWT
} = require('../../../middleware/check_token')
const jwt = require('jsonwebtoken')

router.post('/', checkJWT, async (req, res) => {
  const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
      if (err) return false
      return authData
  })

  if (!check) {
      res.json({
          'success': false,
          'message': 'Forbidden'
      })
  }

  if (await Image.count(check.id) >= 5)
     return res.json({
          'success': false,
          'message': 'Delete an image before uploading a new one'
      })


  const form = new formidable.IncomingForm()

  form.multiples = true

  form.parse(req)

  form.uploadDir = "/usr/src/api/assets/";

  form.maxFileSize = 1500 * 1024 * 1024;

  form.on("fileBegin", async function(err, file){
      const extension = path.extname(file.name)
      const newfileName = uuidv4().replace(/-/g, '') + extension

      file.path = form.uploadDir + newfileName
      file.name = newfileName;

      if(!(await Image.push(check.id, file.name)))
          return res.json({success: false, message: "upload failed"})
      await Profil.increaseUserFameRating(e(req.body.viewed_id), ratings.UPLOAD)
      return res.json({success: true})

  });

  form.on("error", function(error){
      res.json({success: false, message: "upload failed " + error})
  });
})

module.exports = router
