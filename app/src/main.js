import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import '@/assets/css/tailwind.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

Vue.component('v-select', vSelect)

const files = require.context('./components', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  // axios,
  render: h => h(App)
  // created: async function () {
  //   // const loggedUser = {
  //   //   'id': this.$store.getters['session/getUserId'],
  //   //   'name': this.$store.getters['session/getUserName'],
  //   //   'email': this.$store.getters['session/getUserEmail']
  //   // }
  //   // console.log(loggedUser)
  //   // // `this` points to the vm instance
  //   // console.log(this.$store.getters['session/getUser'])
  //   // if (this.$store.getters['session/getUserId'] !== null) {
  //   //   console.log('ok')
  //   //   const loggedUser = {
  //   //     'id': this.$store.getters['session/getUserId'],
  //   //     'name': this.$store.getters['session/getUserName'],
  //   //     'email': this.$store.getters['session/getUserEmail']
  //   //   }
  //   //   this.$socket.open()
  //   //   this.$socket.emit('connect', loggedUser)
  //   // }
  //   this.$socket.open()
  //   let res = await this.$store.getters['session/getUserId']
  //   console.log(res )
  //   this.$socket.emit('is_user', Object.entries(this.$store.state.session.user))
  //   // if (this.$store.state.session.user.id) {
  //   //   this.$socket.open()
  //   //   this.$socket.emit('login', this.$store.state.user)
  //   // }
  // }
}).$mount('#app')
