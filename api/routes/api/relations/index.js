const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const util = require('util')



// @route POST api/version/tags
// @desc  Register a new user
// @access Public
router.get('/', checkJWT, async (req, res) => {

  try {
    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    sql = 'SELECT * FROM matchs WHERE user_id = ? OR match_id = ?'
    const matchs = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(check.id)]
    })
    if (matchs && !matchs.length) {
        res.json({
            'success': false
        })
    }

    const profils = await Promise.all(
        matchs.map(async (m) => {
              const match_id = (check.id == m.user_id) ? m.match_id : m.user_id;

              sql = 'SELECT DISTINCT username, avatar FROM users \
                                  WHERE users.id = ?'
              const user = await connection.query({
                  sql,
                  timeout: 40000,
                  values: [match_id]
              })
              if (user && !user.length) {
                  res.json({
                      'success': false
                  })
              }
              return {
                username : user[0].username,
                avatar: user[0].avatar,
                lastMessage: "",
                lastDateMessage: ""
              };
            })
        )
        profils.reduce((acc, m) => (acc + m))
        console.log(profils);
    // matchs.forEach(
    //   (element) => {
    //     const match_id = (check.id == element.user_id) ? element.match_id : element.user_id;
    //
    //
    //
    //     sql = 'SELECT DISTINCT * FROM users \
    //                         WHERE users.id = ?'
    //
    //     const user = await connection.query({
    //         sql,
    //         timeout: 40000,
    //         values: [match_id]
    //     })
    //     console.log(check);
    //     if (user && !user.length) {
    //         res.json({
    //             'success': false
    //         })
    //     }
    //     console.log(user);
    //   }
    // );


    // const profil = await connection.query({
    //     sql,
    //     timeout: 40000,
    //     values: [check.id]
    // })
    // if (profil && !profil.length) {
    //     res.json({
    //         'success': false
    //     })
    // }
    //
    // sql = 'SELECT DISTINCT * FROM users \
    //                     WHERE users.id = ?'
    //
    // const user = await connection.query({
    //     sql,
    //     timeout: 40000,
    //     values: [check.id]
    // })
    // console.log(check);
    // if (user && !user.length) {
    //     res.json({
    //         'success': false
    //     })
    // }
    //
    // sql = 'SELECT DISTINCT * FROM location_users \
    // WHERE location_users.user_id = ?'
    // const location = await connection.query({
    //     sql,
    //     timeout: 40000,
    //     values: [check.id]
    // })
    // if (location && !location.length) {
    //     res.json({
    //         'success': false
    //     })
    // }
    //
    // sql = 'SELECT tags.id, tags.name FROM tags \
    //        JOIN user_tag WHERE user_tag.user_id = ? \
    //        AND user_tag.tag_id = tags.id'
    //
    // const user_tags = await connection.query({
    //     sql,
    //     timeout: 40000,
    //     values: [check.id]
    // })
    //
    // res.json({
    //     success: true,
    //     authData: check,
    //     user: user[0],
    //     profil: profil[0],
    //     location: location[0],
    //     tags: user_tags
    // })







    res.json({
        matchs: matchs,
    })
  } catch (error) {
    throw new Error('Profil update ' + error)
  }
})

module.exports = router
