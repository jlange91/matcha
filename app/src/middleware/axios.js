import axios from 'axios'
import NProgress from 'nprogress'
import session from '../store/modules/session'
import profil from '../store/modules/profil'
import tags from '../store/modules/tags'

// create a new axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000/api/v1'
})

// before a request is made start the nprogress
instance.interceptors.request.use(config => {
  //console.log('axios request')
  const exp = localStorage.getItem("token_exp")
  const token = localStorage.getItem("token")
  session.state.token = token
  session.state.exp = exp
  const now = new Date()
  const expDate = new Date(exp)
if (token && expDate > now) {
      config.headers.Authorization = `Bearer ${token}`;
  } else if (token && expDate < now) {
    session.state.token = ""
    session.state.logged = false
    session.state.exp = ""
  }
  NProgress.start()
  return config
})

// before a response is returned stop nprogress
instance.interceptors.response.use(response => {
  // console.log('axios response')
  if (response.data.authData) {
    session.state.user.id = response.data.authData.id
    session.state.user.email = response.data.user.email
    session.state.user.username = response.data.user.username
    session.state.user.first_name = response.data.user.first_name
    session.state.user.last_name = response.data.user.last_name
    profil.state.profil = response.data.profil
    profil.state.location = response.data.location
    tags.state.tags = response.data.tags
  }
  NProgress.done()
  return response
})

export default instance