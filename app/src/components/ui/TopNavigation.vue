<template>
  <nav
    class="flex items-center justify-between flex-wrap bg-white shadow border-t-4 border-teal-600 px-6 py-4"
  >
    <div class="flex items-center flex-no-shrink text-teal-600 mr-6">
      <router-link to="/" class="font-semibold text-xl tracking-tight">Matcha</router-link>
          <div  v-if="getLogged && getToken" class="inline-flex items-center ml-4">
            <span
              class="no-underline block sm:inline-block sm:mt-0 text-teal-600 mr-3"
            >{{ getUser.username }}</span>
            <span
              :class="getSocket ? 'bg-green-400' : 'bg-red-400'"
              class="rounded-full h-2 w-2 flex items-center justify-center mr-3"
            ></span>
            <notifications />
            <router-link to="/chat">
              <messages />
            </router-link>
          </div>
    </div>
    <div class="block md:hidden">
      <button
        @click="toggle"
        class="flex items-center px-3 py-2 border rounded text-teal-300 border-teal-light hover:text-teal-500 hover:border-white"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div
      :class="open ? 'block': 'hidden'"
      class="w-full flex-grow md:flex md:items-center md:w-auto"
    >
      <div></div>

      <div class="mt-4 md:mt-0 flex w-full items-center justify-between">
        <div v-if="getLogged && getToken" class="flex flex-wrap justify-end flex-end w-full">
          <div class="w-full md:w-auto my-4">
            <router-link
              to="/matches"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
            >Matches</router-link>
            <router-link
              to="/users"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
            >All users</router-link>
            <router-link
              to="/profil"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
            >Profil</router-link>
            <a
              @click.prevent="logout"
              href="#"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
            >Logout</a>
          </div>
        </div>
        <div v-else>
          <router-link
            to="/register"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
          >Register</router-link>
          <router-link
            to="/login"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
          >Login</router-link>

          <router-link
            to="/users"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-600 hover:text-teal-500 mr-4 w-full md:w-auto"
          >All users</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "../../middleware/axios";
import socket from "../../middleware/socket-instance";

export default {
  data() {
    return {
      open: false
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    //  loginEvent() {
    //     this.$socket.open()
    //     this.$socket.emit('login', true)
    // },
    async logout() {
      axios
        .post("logout")
        .then(() => {
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
        })
        .catch(e => console.log(e));
    },
    ...mapActions({
      clearAuth: "session/clearSession",
      clearUser: "session/clearUser",
      clearProfil: "profil/clearUserProfil",
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess",
      unsetSocket: "session/unsetSocket"
    })
  },
  computed: {
    ...mapGetters({
      getLogged: "session/getLogged",
      getToken: "session/getToken",
      getUser: "session/getUser",
      getUserId: "session/getUserId",
      getSocket: "session/getSocket"
    })
  }
};
</script>

<style>
</style>
