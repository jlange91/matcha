<template>
  <div id="app" class="antialiased font-mono bg-teal-100 min-h-screen">
    <top-navigation/>
    <alert/>
    <router-view/>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
  created() {
    setTimeout(() => {
  let user = this.getUserId
      if (user) {
        this.$socket.open()
      }
    }, 1000)
    
},
updated() {
  setTimeout(() => {
  let user = this.getUserId
      if (user) {
        this.$socket.open()
      }
    }, 1000)
},

    computed: {
    ...mapGetters({
      getLogged: "session/getLogged",
      getToken: "session/getToken",
      getUserId: "session/getUserId",
      getUserName: "session/getUserName",
      getUserEmail: "session/getUserEmail"
    }),
 
  }
}
</script>
