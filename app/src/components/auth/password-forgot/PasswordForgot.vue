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
    </div>
    <div class="flex justify-between w-full items-center">
      <button
        type="submit"
        @click.prevent="processFormInput"
        class="focus:outline-none bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
      >Send reset link</button>
    </div>
  </form>
</template>

<script>
import axios from "../../../middleware/axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      user: {
        email: ""
      },
      error: {
        email: false
      },
      error_message: {
        email: ""
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
    const self = this
      axios
        .post(`user/password-forgot`, this.user)
        .then(res => {
          if (res.data.success) {
            this.setMessage(res.data.message);
            this.setSuccess(true);
            this.setVisibility(true);
            this.$router.push("/");
          } else {
            this.setMessage(res.data.message);
            this.setSuccess(false);
            this.setVisibility(true);
            if (res.data.errors) {
              const errors = res.data.errors;
              errors.forEach(error => {
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
  }
};
</script>
