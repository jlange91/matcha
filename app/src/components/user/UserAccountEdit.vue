<template>
  <form
    class="container bg-white mx-auto w-full max-w-xs px-3 py-4 shadow rounded border-t-4 border-teal-500 mt-12"
  >
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6">
        <app-input
          @focus="error.email = false"
          :error="error.email"
          v-model="new_user.email"
          :error-message="error_message.email"
          type="email"
          name="email"
        >Email</app-input>
      </div>
      <div class="w-full px-3">
        <app-input
          @focus="error.username = false"
          :error="error.username"
          v-model="new_user.username"
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
          v-model="new_user.first_name"
          :error-message="error_message.first_name"
          type="text"
          name="first_name"
        >First Name</app-input>
      </div>
      <div class="w-full px-3">
        <app-input
          @focus="error.last_name = false"
          :error="error.last_name"
          v-model="new_user.last_name"
          :error-message="error_message.last_name"
          type="text"
          name="last_name"
        >Last Name</app-input>
      </div>
    </div>
    <!-- <div class="flex flex-wrap -mx-3 mb-6">
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
    </div>-->
    <div>
      <button
        type="submit"
        @click.prevent="processFormInput"
        class="focus:outline-none bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
      >Save</button>
    </div>
  </form>
</template>

<script>
import axios from "../../middleware/axios";
import { mapActions } from "vuex";

export default {
  name: "UserAccountEdit",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      new_user: null,
      error: {
        email: false,
        username: false,
        first_name: false,
        last_name: false
      },
      error_message: {
        email: "",
        username: "",
        first_name: "",
        last_name: ""
      }
    };
  },
  created() {
    this.new_user = Object.assign({}, this.user);
  },
  computed: {
    changedEmail() {
      return this.new_user.email === this.user.email;
    }
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
      Object.keys(this.new_user).forEach((key, index) => {
        if (self.new_user[key] === "") {
          self.error[key] = true;
          empty = true;
        }
      });
      if (!empty) this.submit();
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
      this.setMessage("Please check your email and confirm it");
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
    }),
    submit() {
      const self = this;
      const sameEmail = this.changedEmail;
      axios
        .post("user/update", { same_email: sameEmail, user: this.new_user })
        .then(res => {
          if (res.data.success) {
            if (res.data.loggedIn) {
              this.setMessage("Your account is updated");
              this.setSuccess(true);
              this.setVisibility(true);
            } else {
              this.logout();
            }
          } else {
            this.setMessage(res.data.message);
            this.setSuccess(false);
            this.setVisibility(true);
            if (res.data.errors) {
              console.log(res.data.errors);
              const err = res.data.errors;
              err.forEach(error => {
                self.error[error.param] = true;
                self.error_message[error.param] = error.msg;
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
    }
    // submit() {
    //   const self = this;
    //   axios
    //     .post(`user/create`, this.user)
    //     .then(res => {
    //       if (res.data.success) {
    //         this.$router.push("/login");
    //         this.setMessage(res.data.message);
    //         this.setSuccess(true);
    //         this.setVisibility(true);
    //       } else {
    //         this.setMessage(res.data.message);
    //         this.setSuccess(false);
    //         this.setVisibility(true);
    //         if (res.data.errors) {
    //           console.log(res.data.errors);
    //           const err = res.data.errors;
    //           err.forEach(error => {
    //             self.error[error.param] = true;
    //             self.error_message[error.param] = error.msg
    //             self.user[error.param] = "";
    //           });
    //         }
    //       }
    //     })
    //     .catch(error => {
    //       self.setMessage("There was a problem please try again");
    //       self.setSuccess(false);
    //       self.setVisibility(true);
    //       if (error.response) {
    //         // The request was made and the server responded with a status code
    //         // that falls out of the range of 2xx
    //         console.log(error.response.data);
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //       } else if (error.request) {
    //         // The request was made but no response was received
    //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //         // http.ClientRequest in node.js
    //         console.log(error.request);
    //       } else {
    //         // Something happened in setting up the request that triggered an Error
    //         console.log("Error", error.message);
    //       }
    //       console.log(error.config);
    //     });
    // },
    // changePasswordInputType() {
    //   if (this.user.password !== "")
    //     return (this.password_type =
    //       this.password_type === "password" ? "text" : "password");
    // }
  }
  // computed: {
  //   userFirstName() {
  //     if (this.user.first_name)
  //     return this.user.first_name
  //   },
  //     userLastName() {
  //             if (this.user.last_name)

  //     return this.user.last_name
  //   },
  //     userEmail() {
  //       if (this.user.email)
  //     return this.user.email
  //   },
  //   userUserName() {
  //     if (this.user.username)
  //     return this.user.username
  //   }
  // //   passwordText() {
  // //     if (this.password_type === "password" && this.user.password !== "")
  // //       return "Show password";
  // //     else if (this.password_type !== "password" && this.user.password !== "")
  // //       return "Hide password";
  // //     else return;
  // //   }
  // // },
  // // created() {

  // }
};
</script>

<style>
</style>
