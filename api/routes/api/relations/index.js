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

router.get('/', checkJWT, async (req, res) => {

  try {
    const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
        if (err) return false
        return authData
    })

    if (!check) {
        res.json({
            'success': false,
            'message': 'Forbidden'
        })
        return (false);
    }
    sql = 'SELECT * FROM matchs WHERE user_id = ? OR match_id = ?'
    const matchs = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id), e(check.id)]
    })
    if (matchs && !matchs.length) {
      console.log("pute");
        res.json({
            'success': false
        })
        return (false);
    }

    const profils = await Promise.all(
      matchs.map(async (m) => {
        const match_id = (check.id == m.user_id) ? m.match_id : m.user_id;
        var avatar,
            lastMessage,
            lastDateMessage;

        sql = 'SELECT DISTINCT username, avatar FROM users \
                            WHERE users.id = ?'
        const user = await connection.query({
            sql,
            timeout: 40000,
            values: [match_id]
        })
        if (user && !user.length) {
            return {};
        }

        sql = 'SELECT body, DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") AS date \
                FROM messages \
                WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) \
                ORDER BY created_at DESC \
                LIMIT 1;'
        const message = await connection.query({
            sql,
            timeout: 40000,
            values: [e(check.id), e(match_id), e(match_id), e(check.id)]
        })
        lastMessage = (message && !message.length) ? '' : message[0].body;
        lastDateMessage = (message && !message.length) ? '' : message[0].date;




        // sql =  'SELECT * \
        //         (SELECT username, avatar\
        //           FROM users \
        //           WHERE users.id = ?) \
        //         (SELECT body, DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") AS date \
        //           FROM messages \
        //           WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) \
        //           ORDER BY created_at DESC \
        //           LIMIT 1);'
        // const test = await connection.query({
        //     sql,
        //     timeout: 40000,
        //     values: [match_id, e(check.id), e(match_id), e(match_id), e(check.id)]
        // })
        // console.log(test);



        avatar = "/api/v1/images/get/";
        avatar += (!user[0].avatar) ? 'no-profil.png': user[0].avatar;
        console.log(avatar);
        return {
          username : user[0].username,
          avatar: avatar,
          lastMessage: lastMessage,
          lastDateMessage: e(lastDateMessage)
        };
      })
    )
    if (profils && !profils.length) {
        res.json({
            'success': false
        })
        return (false);
    }
    profils.reduce((acc, m) => (acc + m))
    res.json({
      success: true,
      relations: profils
    });
  } catch (error) {
    throw new Error('Profil update ' + error)
  }
})

module.exports = router
