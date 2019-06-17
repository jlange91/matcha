// Load env variables
require('dotenv').config({
  path: '.env'
})

const express = require('express')
const cors = require('cors')

const app = express()

const server = require('http').createServer(app)

const io = require('socket.io').listen(server, { origins: 'http://localhost:8080/*'})
const jwt = require('jsonwebtoken')

app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:8080'
}

app.use(cors(corsOptions))

// Routes
const version = 'v1'

// DB setup
const setup = require('./database/setup')
setup.database()

app.use(`/api/${version}/user/login`, require('./routes/api/auth/login'))

app.use(`/api/${version}/user/create`, require('./routes/api/auth/register'))

app.use(`/api/${version}/user/confirmation`, require('./routes/api/auth/confirmation'))

app.use(`/api/${version}/user/password-forgot`, require('./routes/api/auth/password-forgot'))

app.use(`/api/${version}/user/password-reset`, require('./routes/api/auth/password-reset'))

app.use(`/api/${version}/user/update`, require('./routes/api/user/update'))
app.use(`/api/${version}/user/delete`, require('./routes/api/user/delete'))
app.use(`/api/${version}/user/update-password`, require('./routes/api/user/update-password'))
app.use(`/api/${version}/user/update-location`, require('./routes/api/user/update-location'))

app.use(`/api/${version}/user/profil`, require('./routes/api/user/profil'))

app.use(`/api/${version}/user/profil/edit`, require('./routes/api/user/profil-edit'))

app.use(`/api/${version}/tags`, require('./routes/api/tags/tags'))

app.use(`/api/${version}/images/upload`, require('./routes/api/images/create'))

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
  console.log('client connection >', socket.id, socket.decoded)
  // Connection now authenticated to receive further events
   socket.on('logout', function () {
    console.log('client logout >', socket.id, socket.decoded)
    socket.disconnect()
  })

  socket.on('message', function(message) {
      io.emit('message', message);
  });


  socket.on('disconnect', function () {
    console.log('client disconnectt >', socket.id, socket.decoded)
  })

});

const port = process.env.PORT || 5000

server.listen(port)