import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import session from './store/modules/session'
import message from './store/modules/messages'
import user from './store/modules/user'
import axios from "./middleware/axios";

 //import axios from "../../../middleware/axios";



Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Home.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Auth/Login.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Auth/Register.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/password-forgot',
      name: 'password-forgot',
      component: () => import('./views/Auth/PasswordForgot.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/user/:email/confirmation/:hash',
      name: 'user_confirmation',
      component: () => import('./views/User/Confirmation.vue'),
      beforeEnter: requireUserHash
    },
    {
      path: '/password-reset/:email/:hash',
      name: 'password_reset',
      component: () => import('./views/Auth/PasswordReset.vue'),
      beforeEnter: requirePasswordReset
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('./views/User/Profil.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('./views/User/Chat.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/User/Users.vue'),
      // beforeEnter: requireAuth
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('./views/Matches/Matches.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/user/:user',
      name: 'user',
      component: () => import('./views/User/User.vue'),
      beforeEnter: fetchUser
    }
  ]
})


const logout = async () => {
  const token = localStorage.getItem("token");
  if (token) localStorage.removeItem("token");
  const token_exp = localStorage.getItem("token_exp");
  if (token_exp) localStorage.removeItem("token_exp");
  socket.disconnect();
  socket.close();
  this.unsetSocket();
  this.clearAuth();
  this.clearUser();
  this.clearProfil();
  this.setMessage("You are logged out");
  this.setSuccess(true);
  this.setVisibility(true);
  this.$router.push("/");
}

async function requirePasswordReset(to, from, next) {
  try {

    const exp = localStorage.getItem("token_exp")
    const token = localStorage.getItem("token")
    const now = new Date()
    const expDate = new Date(exp)
    if (token && expDate > now) {
      session.state.token = token
      session.state.logged = true
      session.state.exp = exp
      return next('/profil')
    }

    const email = to.params.email
    const hash = to.params.hash

    if (!email || !hash)
      next('/')

    const result = await axios.post(`user/password-reset/check`, {
      email: email,
      hash: hash
    })
    if (!result.data.success) {
      message.state.visible = true
      message.state.success = false
      message.state.message = result.data.message
      return next('/')
    }
    message.state.visible = true
    message.state.success = true
    message.state.message = result.data.message
    return next()
  } catch (e) {
    next('/')
  }
}

async function requireUserHash(to, from, next) {

  try {
    const email = to.params.email
    const hash = to.params.hash

    if (!email || !hash)
      next('/')
    const result = await axios.post(`user/confirmation`, {
      email: email,
      hash: hash
    })
    if (!result.data.success) {
      message.state.visible = true
      message.state.success = false
      message.state.message = result.data.message
      return next('/')
    }
    message.state.visible = true
    message.state.success = true
    message.state.message = result.data.message
    return next('/login')
  } catch (e) {
    return next('/')
  }
}

async function requireGuest(to, from, next) {
  try {
    const res = await axios.post(`user/profil`)
    if (res.data.success)
      return next('/profil')
    return next()
  } catch (e) {
    message.state.visible = true
    message.state.success = false
    message.state.message = e
    return next()
  }
}

async function fetchUser(to, from, next) {
  try {
    const endpoint = `/user`
    const res = await axios.post(endpoint, {username: to.params.user})
    if (res.data.success) {
      user.state.data = res.data.user
      return next()
    }
    else
      return next('/')
  } catch (error) {
    message.state.visible = true
    message.state.success = false
    message.state.message = error
    return next('/')
  }
}

async function requireAuth(to, from, next) {
  try {
    const res = await axios.post(`user/profil`)
    if (!res.data.success)
      return next('/login')
    return next()
  } catch (e) {
    message.state.visible = true
    message.state.success = false
    message.state.message = e
    return next()
  }
}

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load
  if (to.name) {
    // this.$socket.open()
    // this.$socket.emit('login', true);    const exp = localStorage.getItem("token_exp")
    const token = localStorage.getItem("token")
    const exp = localStorage.getItem("token_exp")
    const now = new Date()
    const expDate = new Date(exp)
    if (token && expDate > now) {
      session.state.token = token
      session.state.logged = true
      session.state.exp = exp
      axios.post(`user/profil`)
    }
    // Start the route progress bar.
    NProgress.start()
  }
  return next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
