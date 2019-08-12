const jwt = require('jsonwebtoken')
const LoggedUsers = require('../models/LoggedUsers')
const Notifications = require('../models/Notifications')

module.exports = function (server) {
  var io = require('socket.io')(server);

  io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, process.env.APP_KEY, function(err, decoded) {
        if(err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
        next(new Error('Authentication error'));
    }
  }).on('connection', function(socket) {

    LoggedUsers.push(socket.decoded.id, socket.id)

    console.log('client connection >', socket.id, socket.decoded)

    // Connection now authenticated to receive further events
     socket.on('logout', function () {
      console.log('client logout >', socket.id, socket.decoded)
      socket.disconnect()
    })

    socket.on('message', async (userId, focusId) => {
      Notifications.push(userId, focusId, 'message');
      let user = await LoggedUsers.get(focusId);
      if (!user)
        return ;
      socket.broadcast.to(user.socket_id).emit('message');
    });

    socket.on('notif', async (userId, focusId, type) => {
      let user = await LoggedUsers.get(userId);
      if (!user)
        return ;
       if (Notifications.push(userId, focusId, type))
        socket.broadcast.to(user.socket_id).emit('notif');
    });

    socket.on('disconnect', () => {
      LoggedUsers.remove(socket.id)
      console.log('client disconnect >', socket.id, socket.decoded)
    });

    socket.on('end', function (){
      socket.disconnect(0);
    });

  });
}
