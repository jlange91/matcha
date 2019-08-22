const express = require('express')
const router = express.Router()
const e = require('escape-html')
const jwt = require('jsonwebtoken')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const Message = require('../../../models/Message')

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

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
      return (false);
  }

  const {
      focus_id,
      limit
  } = req.body


  var messages = await Message.getConversation(check.id, focus_id, limit)

  if (messages && !messages.length) {
      res.json({
        success: true,
        messages: null,
        seen: false
      })
  }
  else
  {
    Message.setSeen(focus_id, check.id);
    var seen = messages.filter((message) => {
      if (message.from_id === check.id && !message.seen)
        return message;
      else
        return ;
    })
    seen = isEmpty(seen);
    res.json({
      success: true,
      messages: messages,
      seen: seen
    });
  }
})

module.exports = router
