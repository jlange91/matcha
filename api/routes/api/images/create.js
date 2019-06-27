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

        const form = new formidable.IncomingForm()

        form.multiples = true

        form.parse(req)

        form.uploadDir = "/usr/src/api/assets/";

        form.maxFileSize = 1500 * 1024 * 1024;


        const uploads = [];


        form.on("fileBegin", function(err, file){
            const extension = path.extname(file.name)
            const newfileName = uuidv4().replace(/-/g, '') + extension

            file.path = form.uploadDir + newfileName
            file.name = newfileName;
        });


        form.on('file', function(field, file){
            var fileField = {};
            fileField[field]= file;
            uploads.push(fileField);
            console.log("uploads > ", uploads)
        });

        console.log("suce")

        // uploads.forEach((image) => {
        //
        //     let sql = 'INSERT INTO images (user_id, name) \
        //                          VALUES (?, ?)'
        //
        //     let result = await connection.query({
        //         sql,
        //         timeout: 40000,
        //         values: [check.id, image.name]
        //     })
        //
        //     if(!result)
        //       res.json({success: false, message: "upload failed"})
        //
        //   })


        // form.on("error", function(error){
        //     console.log(error)
        // });
        // let result
        //
        // form.on('end', function(){
        //
        //
        //
        //     })
        //
        //
        //
        // })

        // res.json(result)

    } catch (err) {
        throw new Error('Error on post image create' + err)
    }
})

module.exports = router
