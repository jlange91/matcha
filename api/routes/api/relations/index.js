const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Like = require('../../../models/Like.js')
const Message = require('../../../models/Message.js')

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

    const matchedUsers = await Like.getMatchedUsers(check.id)

    await asyncForEach(matchedUsers, async (matchedUser) => {
          const message = await Message.getLastFromId(check.id, matchedUser.id);
          matchedUser.lastMessage = (message && !message.length) ? '' : message[0].body;
          matchedUser.lastDateMessage = (message && !message.length) ? '' : message[0].date;
        }
    );
    res.json({
      success: true,
      relations: matchedUsers
    });
  } catch (error) {
    throw new Error('Relations root error ' + error)
  }
})

module.exports = router
