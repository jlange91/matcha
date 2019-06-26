const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const formidable = require('formidable')

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

        const form = new formidable.IncomingForm();
        
        form.multiples = true;

        form.parse(req)

        form.uploadDir = "/usr/src/api/assets/";
       
        form.maxFileSize = 1500 * 1024 *1024;
        
        const uploads = [];


        form.on("fileBegin", function(err, file){
            const extension = file.name.split('.')[1];
            const index = (file.name).lastIndexOf(extension);
            const onlyName = (file.name).substr(0, index);
            const newfileName = onlyName + Date.now() + "." + extension;

            const fileName = form.uploadDir + newfileName;
            file.path = fileName;
        });


        form.on('file', function(field, file){
            var fileField = {};
            fileField[field]= file;
            uploads.push(fileField);
            console.log("uploads > ", uploads)
        });

       
        // form.on("error", function(error){
        //     console.log(error)
        // });

        // form.on('end', function(){
        //     app.httpMsgs.sendJSON(req, res, uploads);
        // })


    } catch (err) {
        throw new Error('Error on post image create' + err)
    }
})

module.exports = router