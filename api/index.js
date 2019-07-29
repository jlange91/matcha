// Load env variables
require('dotenv').config({
  path: '.env'
})

const express = require('express')
const cors = require('cors')

const app = express()

const server = require('http').createServer(app)

var io = require('socket.io')(server);
const jwt = require('jsonwebtoken')


app.use(express.json())

const corsOptions = {
  origin: 'http://localhost'
}

app.use(cors(corsOptions))

// Routes
const version = 'v1'

// DB setup
const setup = require('./database/setup')
setup.database()

app.use(`/${version}/user/login`, require('./routes/api/auth/login'))
app.use(`/${version}/user/create`, require('./routes/api/auth/register'))
app.use(`/${version}/user/confirmation`, require('./routes/api/auth/confirmation'))
app.use(`/${version}/user/password-forgot`, require('./routes/api/auth/password-forgot'))
app.use(`/${version}/user/password-reset`, require('./routes/api/auth/password-reset'))
app.use(`/${version}/user/update`, require('./routes/api/user/update'))
app.use(`/${version}/user/delete`, require('./routes/api/user/delete'))
app.use(`/${version}/user/update-password`, require('./routes/api/user/update-password'))
app.use(`/${version}/user/update-location`, require('./routes/api/user/update-location'))
app.use(`/${version}/user/profil`, require('./routes/api/user/profil'))
app.use(`/${version}/user/avatar`, require('./routes/api/user/avatar'))
app.use(`/${version}/user/profil/edit`, require('./routes/api/user/profil-edit'))

app.use(`/${version}/tags`, require('./routes/api/tags/'))

app.use(`/${version}/images/upload`, require('./routes/api/images/create'))
app.use(`/${version}/images/user`, require('./routes/api/images/user_image'))
app.use(`/${version}/images/delete`, require('./routes/api/images/delete'))
app.use(`/${version}/images/get`, require('./routes/api/images/get'))

app.use(`/${version}/relations/`, require('./routes/api/relations/'))


app.use(`/${version}/messages/create`, require('./routes/api/messages/create'))
app.use(`/${version}/messages`, require('./routes/api/messages'))

// app.use(`/${version}/messages/`, require('./routes/api/messages/'))
// app.use(`/${version}/messages/create`, require('./routes/api/messages/create'))
// app.use(`/${version}/messages/delete`, require('./routes/api/messages/delete'))
// app.use(`/${version}/messages/update`, require('./routes/api/messages/update'))

var loggedUsers = [];

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
})
.on('connection', function(socket) {

  loggedUsers.push({
    id : socket.id,
    userId : socket.decoded.id
  });

  console.log('client connection >', socket.id, socket.decoded,
              'loggedUsers > ', loggedUsers)

  // Connection now authenticated to receive further events
   socket.on('logout', function () {
    console.log('client logout >', socket.id, socket.decoded)
    socket.disconnect()
  })

  socket.on('message', (userId, message) => {
    let socket_id = loggedUsers.find(function(el) {
      return el.userId === userId;
    });
    if (socket_id)
      socket_id = socket_id.id;
    else
      return ;
    console.log("ici: " + socket_id)
     socket.broadcast.to(socket_id).emit('message', socket.decoded.id, message);
 });


  socket.on('disconnect', () => {
    var newUsersSocket = loggedUsers.filter(el => {
      if (el.id === socket.id)
        return ;
      return el;
    });
    loggedUsers = newUsersSocket;
    console.log(loggedUsers);
    console.log('client disconnect >', socket.id, socket.decoded,
                'loggedUsers > ', loggedUsers)
  });

  socket.on('end', function (){
    socket.disconnect(0);
  });

});

const port = process.env.PORT || 8080

server.listen(port)
