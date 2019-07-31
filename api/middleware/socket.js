const jwt = require('jsonwebtoken')
const LoggedUsers = require('../models/LoggedUsers')

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

    socket.on('message', (userId) => {
      let user = LoggedUsers.get(userId);
      if (!user)
        return ;
       socket.broadcast.to(user.socket_id).emit('message');
    });

    socket.on('notif', (userId) => {
      let user = LoggedUsers.get(userId);
      if (!user)
        return ;
       socket.broadcast.to(user.socket_id).emit('notif');
    });

    socket.on('disconnect', () => {
      LoggedUsers.remove(socket.id)
      console.log(loggedUsers);
      console.log('client disconnect >', socket.id, socket.decoded,
                  'loggedUsers > ', loggedUsers)
    });

    socket.on('end', function (){
      socket.disconnect(0);
    });

  });
}
