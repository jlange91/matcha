const jwt = require('jsonwebtoken')
const LoggedUser = require('../models/LoggedUser')
const Notification = require('../models/Notification')

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

    LoggedUser.push(socket.decoded.id, socket.id)

    console.log('client connection >', socket.id, socket.decoded)

    // Connection now authenticated to receive further events
     socket.on('logout', function () {
      console.log('client logout >', socket.id, socket.decoded)
      socket.disconnect()
    })

    socket.on('message', async (userId, focusId) => {
      Notification.push(userId, focusId, 'message');
      let users = await LoggedUser.get(focusId);
      if (users && users.length) {
        for (let i = 0; i < users.length; i++)
        {
          socket.broadcast.to(users[i].socket_id).emit('message');
          socket.broadcast.to(users[i].socket_id).emit('notif');
        }
      }
      users = await LoggedUser.get(userId);
      if (users && users.length) {
        for (let i = 0; i < users.length; i++)
          socket.broadcast.to(users[i].socket_id).emit('message');
      }
    });

    socket.on('notif', async (userId, focusId, type) => {
      let users = await LoggedUser.get(userId);
      if (!users)
        return ;
       if (Notification.push(userId, focusId, type))
       {
         for (let i = 0; i < users.length; i++)
          socket.broadcast.to(users[i].socket_id).emit('notif');
       }
    });

    socket.on('disconnect', () => {
      LoggedUser.remove(socket.id)
      console.log('client disconnect >', socket.id, socket.decoded)
    });

    socket.on('end', function (){
      socket.disconnect(0);
    });

  });
}
