const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

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
    sql = 'SELECT * FROM likes WHERE user_id = ?'
    const iLikes = await connection.query({
        sql,
        timeout: 40000,
        values: [e(check.id)]
    })
    if (iLikes && !iLikes.length) {
        res.json({
            'success': false
        })
        return (false);
    }
    var relations = [];

    await asyncForEach(iLikes, async (iLike) => {
      sql = 'SELECT * FROM likes WHERE user_id = ? AND liked_id = ?'
      const theirLikes = await connection.query({
          sql,
          timeout: 40000,
          values: [e(iLike.liked_id), e(check.id)]
      })
      if (theirLikes && theirLikes.length) {
        sql = 'SELECT DISTINCT id, username, avatar FROM users \
                            WHERE users.id = ?'
        const user = await connection.query({
            sql,
            timeout: 40000,
            values: [iLike.liked_id]
        })
        if (user && user.length) {

          sql = 'SELECT body, DATE_FORMAT(created_at, "%m/%d/%Y %H:%i:%s") AS date \
                  FROM messages \
                  WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) \
                  ORDER BY created_at DESC \
                  LIMIT 1;'
          const message = await connection.query({
              sql,
              timeout: 40000,
              values: [e(check.id), e(iLike.liked_id), e(iLike.liked_id), e(check.id)]
          })
          user[0].lastMessage = (message && !message.length) ? '' : message[0].body;
          user[0].lastDateMessage = (message && !message.length) ? '' : message[0].date;
          relations.push(user[0])
        }
      }
    });
    res.json({
      success: true,
      relations: relations
    });
  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
