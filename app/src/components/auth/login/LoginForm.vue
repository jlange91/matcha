<template>
  <form
    class="container bg-white mx-auto w-full max-w-xs px-3 py-4 shadow rounded border-t-4 border-teal-500"
  >
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6">
        <app-input
          @focus="error.login = false"
          :error="error.login"
          v-model="user.login"
          :error-message="error_message.login"
          type="text"
          name="login"
        >Email or Username</app-input>
      </div>
      <div class="w-full px-3">
        <div>
          <app-input
            @focus="error.password = false"
            :error="error.password"
            v-model="user.password"
            :error-message="error_message.password"
            :type="password_type"
            name="current-password"
          >Password</app-input>
          <span
            v-show="user.password !== ''"
            @click.prevent="changePasswordInputType"
            class="focus:outline-none text-xs italic my-2 text-gray-500 cursor-pointer"
          >{{ passwordText }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-between w-full items-center">
         <button
        type="submit"
        @click.prevent="processFormInput"
        class="focus:outline-none bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
      >Login</button>
      <router-link to="/password-forgot" class="whitespace-no-wrap text-xs text-teal-500 hover:font-bold">
        Forgot your password ?
      </router-link>
    </div>
  </form>
</template>

<script>
import axios from "../../../middleware/axios";
import { mapActions, mapGetters } from "vuex";

import io from 'socket.io-client';

import socket from '../../../middleware/socket-instance';

export default {
  created() {
    this.getIp();
  },
  data() {
    return {
      password_type: "password",
      user: {
        login: "",
        password: "",
        ip: ""
      },
      error: {
        login: false,
        password: false
      },
      error_message: {
        login: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions({
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess",
      setSession: "session/setSession",
      setExp: "session/setExp"
    }),
    changePasswordInputType() {
      if (this.user.password !== "")
        return (this.password_type =
          this.password_type === "password" ? "text" : "password");
    },
    processFormInput() {
      let empty = false;
      const self = this;
      Object.keys(this.user).forEach((key, index) => {
        if (self.user[key] === "") {
          self.error[key] = true;
          empty = true;
        }
      });
      if (!empty) this.submit();
    },
    submit() {
      const self = this;
      axios
        .post(`user/login`, this.user)
        .then(res => {

          if (res.data.success && res.data.token) {
            const loggedUser = {
              'id': this.$store.getters['session/getUserId'],
              'name': this.$store.getters['session/getUserName'],
              'email': this.$store.getters['session/getUserEmail']
            };

            this.setSession(res.data.token);
            this.setExp(res.data.exp)
            this.setMessage(res.data.message);
            this.setSuccess(true);
            this.setVisibility(true);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("token_exp", res.data.exp);
            setTimeout(() => {
              socket.open();
              socket.emit('connection', loggedUser)
                this.$router.push("/");
            }, 200)

          } else {
            this.setMessage(res.data.message);
            this.setSuccess(false);
            this.setVisibility(true);
            if (res.data.errors) {
              const errors = res.data.errors;
              errors.forEach(error => {
                self.error[error.param] = true;
                self.error_message[error.param] = error.msg
                self.user[error.param] = "";
              });
            }
          }
        })
        .catch(error => {
          self.setMessage("There was a problem please try again");
          self.setSuccess(false);
          self.setVisibility(true);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    getIp() {
      axios
        .get("https://api.ipify.org?format=json")
        .then(res => {
          if (res.data.ip) this.user.ip = res.data.ip;
        })
        .catch();
    }
  },
  computed: {
    passwordText() {
      if (this.password_type === "password" && this.user.password !== "")
        return "Show password";
      else if (this.password_type !== "password" && this.user.password !== "")
        return "Hide password";
      else return;
    },
    ...mapGetters({
      getUser: 'session/getUser'
    })
  }
};
</script>

<style>
</style>
