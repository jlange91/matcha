const express = require('express')
const router = express.Router()
const connection = require('../../../middleware/database')
const jwt = require('jsonwebtoken')

const {
    checkJWT
} = require('../../../middleware/check_token')

// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.post('/', checkJWT, async (req, res) => {
  try {

    // http://localhost/api/v1/images/get/
    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    if (!check) {
        return res.json({
            'success': false,
            'message': 'Forbidden'
        })
    }

    let sql = 'SELECT images.user_id FROM images \
                WHERE images.name = ?'

      let result = await connection.query({
                    sql,
                    timeout: 40000,
                    values: [ e(req.image)]
                })
    console.log(result)

    // let sql = 'DELETE FROM images \
    //           WHERE images.name = ?'

    // await connection.query({
    //                 sql,
    //                 timeout: 40000,
    //                 values: [ e(req.image)]
    //             })

      return res.json({
          'success': true,
      })
  } catch(err) {
    throw new Error('Error on post image get' + err)
      }
})

module.exports = router