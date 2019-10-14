require('dotenv').config({
  path: '.env'
})

const express = require('express')
const cors = require('cors')

const app = express()

const server = require('http').createServer(app)

app.use(express.json())

const corsOptions = {
  origin: 'http://localhost'
}

app.use(cors(corsOptions))

// Routes
const version = 'v1'

require('./middleware/socket.js')(server)

app.use(`/${version}/users`, require('./routes/api/user/all'))
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

app.use(`/${version}/profil`, require('./routes/api/user/get-user'))
app.use(`/${version}/spam`, require('./routes/api/user/spam'))

app.use(`/${version}/tags`, require('./routes/api/tags/'))

app.use(`/${version}/images/upload`, require('./routes/api/images/create'))
app.use(`/${version}/images/user`, require('./routes/api/images/user_image'))
app.use(`/${version}/images/delete`, require('./routes/api/images/delete'))
app.use(`/${version}/images/get`, require('./routes/api/images/get'))
app.use(`/${version}/images/user`, require('./routes/api/images/get_user_image'))

app.use(`/${version}/relations/`, require('./routes/api/relations/'))

app.use(`/${version}/matches`, require('./routes/api/matches'))

app.use(`/${version}/likes`, require('./routes/api/likes/create'))
app.use(`/${version}/user/likes`, require('./routes/api/likes/get'))
app.use(`/${version}/likes/destroy`, require('./routes/api/likes/destroy'))

app.use(`/${version}/user/views`, require('./routes/api/views/get'))
app.use(`/${version}/user/browsing`, require('./routes/api/views/browsing'))

app.use(`/${version}/view`, require('./routes/api/views/create'))

app.use(`/${version}/messages/create`, require('./routes/api/messages/create'))
app.use(`/${version}/messages`, require('./routes/api/messages'))

app.use(`/${version}/logged_user`, require('./routes/api/logged/logged_user.js'))

app.use(`/${version}/logout`, require('./routes/api/logged/logout.js'))


app.use(`/${version}/notifications/`, require('./routes/api/notifications/'))
app.use(`/${version}/notifications/setSeen`, require('./routes/api/notifications/setSeen'))

// app.use(`/${version}/messages/`, require('./routes/api/messages/'))
// app.use(`/${version}/messages/create`, require('./routes/api/messages/create'))
// app.use(`/${version}/messages/delete`, require('./routes/api/messages/delete'))
// app.use(`/${version}/messages/update`, require('./routes/api/messages/update'))


const port = process.env.PORT || 8080

server.listen(port)
