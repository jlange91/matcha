<template>
  <nav class="flex items-center justify-between flex-wrap bg-white shadow border-t-4 border-teal-600 px-6 py-4">
    <div class="flex items-center flex-no-shrink text-teal-600 mr-6">
      <router-link to="/" class="font-semibold text-xl tracking-tight">
        Matcha
        👉👌
      </router-link>
    </div>
    <div class="block sm:hidden">
      <button
        @click="toggle"
        class="flex items-center px-3 py-2 border rounded text-teal-300 border-teal-light hover:text-teal-500 hover:border-white"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
    </div>
    <div
      :class="open ? 'block': 'hidden'"
      class="w-full flex-grow sm:flex sm:items-center sm:w-auto"
    >
      <div></div>
      <div class="text-sm sm:flex-grow">
        <div v-if="getLogged && getToken" class="flex justify-between">
          <div class="inline-flex items-center">
            <span
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600  mr-4"
            >😏 {{ getUser.username }}</span>
            <span :class="connected ? 'bg-green-400' : 'bg-red-400'" class="rounded-full h-2 w-2 flex items-center justify-center"></span>
          </div>
          <div>
            <router-link
              to="/profil"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4"
            >Profil</router-link>
            <a
              @click.prevent="logout"
              href="#"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4"
            >Logout</a>
          </div>
        </div>
        <div v-else>
          <router-link
            to="/register"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4"
          >Register</router-link>
          <router-link
            to="/login"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4"
          >Login</router-link>
        </div>
      </div>
      <!-- <div>
        <a href="#" class="no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 sm:mt-0">
            Download
        </a>
      </div>-->
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  mounted() {
   setTimeout(() => {
     this.connected = this.$socket.connected
   }, 1000)
  },
  data() {
    return {
      open: false,
      connected: false
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    logoutEvent() {
      this.$socket.emit("logout", this.getUser);
    },
    //  loginEvent() {
    //     this.$socket.open()
    //     this.$socket.emit('login', true)
    // },
    async logout() {
      await this.logoutEvent();
      const token = localStorage.getItem("token");
      if (token) localStorage.removeItem("token");
      const token_exp = localStorage.getItem("token_exp");
      if (token_exp) localStorage.removeItem("token_exp");
      this.clearAuth();
      this.clearUser();
      this.clearProfil();
      this.setMessage("You are logged out");
      this.setSuccess(true);
      this.setVisibility(true);
      this.$router.push("/");
    },
    ...mapActions({
      clearAuth: "session/clearSession",
      clearUser: "session/clearUser",
      clearProfil: "profil/clearUserProfil",
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess"
    })
  },
  computed: {
    ...mapGetters({
      getLogged: "session/getLogged",
      getToken: "session/getToken",
      getUser: "session/getUser",
      getUserId: "session/getUserId"
    })

  }
};
</script>

<style>
</style>
