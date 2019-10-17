<template>
  <form
    class="container bg-white mx-auto w-full max-w-xs px-3 py-4 shadow rounded border-t-4 border-teal-500"
  >
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6">
        <app-input
          @focus="error.email = false"
          :error="error.email"
          v-model="user.email"
          :error-message="error_message.email"
          type="email"
          name="email"
        >Email</app-input>
      </div>
      <div class="w-full px-3">
        <app-input
          @focus="error.username = false"
          :error="error.username"
          v-model="user.username"
          :error-message="error_message.username"
          type="text"
          name="username"
        >Username</app-input>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 my-6">
      <div class="w-full px-3 mb-6">
        <app-input
          @focus="error.first_name = false"
          :error="error.first_name"
          v-model="user.first_name"
          :error-message="error_message.first_name"
          type="text"
          name="first_name"
        >First Name</app-input>
      </div>
      <div class="w-full px-3">
        <app-input
          @focus="error.last_name = false"
          :error="error.last_name"
          v-model="user.last_name"
          :error-message="error_message.last_name"
          type="text"
          name="last_name"
        >Last Name</app-input>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
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
    <div>
      <button
        type="submit"
        @click.prevent="processFormInput"
        class="focus:outline-none bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
      >Register</button>
    </div>
  </form>
</template>

<script>
import axios from "../../../middleware/axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      password_type: "password",
      user: {
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        password: ""
      },
      error: {
        email: false,
        username: false,
        first_name: false,
        last_name: false,
        password: false
      },
      error_message: {
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions({
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess"
    }),
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
        .post(`user/create`, this.user)
        .then(res => {
          if (res.data.success) {
            this.$router.push("/login");
            this.setMessage(res.data.message);
            this.setSuccess(true);
            this.setVisibility(true);
          } else {
            this.setMessage(res.data.message);
            this.setSuccess(false);
            this.setVisibility(true);
            if (res.data.errors) {
              console.log(res.data.errors);

              const err = res.data.errors;
              err.forEach(error => {
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
    changePasswordInputType() {
      if (this.user.password !== "")
        return (this.password_type =
          this.password_type === "password" ? "text" : "password");
    }
  },
  computed: {
    passwordText() {
      if (this.password_type === "password" && this.user.password !== "")
        return "Show password";
      else if (this.password_type !== "password" && this.user.password !== "")
        return "Hide password";
      else return;
    }
  }
};
</script>

<style>
</style>
