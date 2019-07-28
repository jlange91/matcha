<template>
  <div id="app" class="antialiased font-mono bg-teal-100 min-h-screen">
    <top-navigation/>
    <alert/>
    <router-view/>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

import socket from './middleware/socket-instance';

export default {
    computed: {
      ...mapGetters({
        getUserId: "session/getUserId",
        getUserName: "session/getUserName",
        getUserEmail: "session/getUserEmail",
        getSocket: "session/getSocket"
      })},

    methods: {
      ...mapActions({
        setSocket: "session/setSocket",
        unsetSocket: "session/unsetSocket"
      })
    },

    // open socket if connected
    updated() {
      if (this.getSocket == false) {
        setTimeout(() => {
          const loggedUser = {
            'id': this.getUserId,
            'name': this.getUserName,
            'email': this.getUserEmail
          };

          if (loggedUser.id && loggedUser.name && loggedUser.email) {
            socket.open();
            socket.emit('connection', loggedUser);
            this.setSocket();
          }
          else {
            this.unsetSocket();
          }
        }, 2000)
      }
    }
}
</script>
