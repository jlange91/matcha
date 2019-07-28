const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const formidable = require('formidable')
const path = require('path')
const uuidv4 = require('uuid/v4');


const {
    checkJWT
} = require('../../../middleware/check_token')
const jwt = require('jsonwebtoken')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.post('/', checkJWT, async (req, res) => {

    try {
        //console.log(req)
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
        
        let sql = 'SELECT DISTINCT * FROM images \
        WHERE images.user_id = ?'

        const images = await connection.query({
              sql,
              timeout: 40000,
              values: [check.id]
          })

        if (images.length >= 5)
           return res.json({
                'success': false,
                'message': 'Delete an image before uploading a new one'
            })


        const form = new formidable.IncomingForm()

        form.multiples = true

        form.parse(req)

        form.uploadDir = "/usr/src/api/assets/";

        form.maxFileSize = 1500 * 1024 * 1024;


        const uploads = [];


        form.on("fileBegin", async function(err, file){
            const extension = path.extname(file.name)
            const newfileName = uuidv4().replace(/-/g, '') + extension

            file.path = form.uploadDir + newfileName
            file.name = newfileName;

            let sql = 'INSERT INTO images (user_id, name) \
                                VALUES (?, ?)'
        
            let result = await connection.query({
                sql,
                timeout: 40000,
                values: [check.id, file.name]
            })
            
            if(!result)
                return res.json({success: false, message: "upload failed"})
                    
            return res.json({success: true})

        });

        form.on("error", function(error){
            res.json({success: false, message: "upload failed " + error})
        });
      
       

    } catch (err) {
        throw new Error('Error on post image create' + err)
    }
})

module.exports = router
