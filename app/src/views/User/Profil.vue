<template>
  <div>
    <tabs>
      <tab name="profil" :selected="true">
        <div class="mt-8 p-4 container mx-auto min-w-sm max-w-lg rounded bg-white shadow">
          <div>avatar</div>
          <div>
            Username: {{getUser.username}}
            <br>
            Email: {{getUser.email}}
            <br>
            First name: {{getUser.first_name}}
            <br>
            Last name: {{getUser.last_name}}
          </div>

          <div class="mt-8 flex flex-wrap" v-show="getProfil && getProfil.completed">
            Age: {{age}}
            <br>
            Gender: {{getProfil.gender}}
            <br>
            Sexual preference: {{getProfil.sexual_orientation}}
            <br><p>Biography:
            <span v-html="getProfil.biography" class="break-all"></span></p>
          </div>
           <div class="mt-8 flex flex-wrap">
            <span
              v-for="tag in getTags"
              :key="tag.id"
              class="m-2 bg-teal-100 rounded-full py-1 px-4 text-teal-700"
            >#{{tag.name}}</span>
          </div>
          <div class="mt-8">
            <button
              @click.prevent="getNavigatorLocation()"
              class="p-2 rounded my-4 bg-teal-600 text-white hover:shadow"
            >Update location</button>
            <user-profil-map :lat="lat" :lng="lng"/>
          </div>
         
          <div class="flex flex-row-reverse mt-8">
            <button @click="confirmDelete" class="bg-red-600 rounded text-white p-2">Delete account</button>
          </div>
        </div>
      </tab>
      <tab name="edit-profil">
        <user-profil-edit @profile-complete="complete = 1" :user="getUser" :profil="getProfil"/>
      </tab>
      <tab name="edit-account">
        <user-account-edit :user="getUser"/>
      </tab>
      <tab name="edit-password">
        <user-password-edit class="mt-32"/>
      </tab>
    <tab name="image-upload" @click="is_images = true">
      <image-uploader class="mt-32" :get_images="is_images"/>
    </tab>
      <!-- <tab name="About Us">
      <h1>Why we do it</h1>
      </tab>-->
    </tabs>
    <!-- <drop-zone :token="getToken"/> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "../../middleware/axios";
import moment from "moment";

export default {
  // async updated() {
  //     await axios.post(`user/profil`)
  // },
  data() {
    return {
      is_images: false,
      completed: null
    };
  },
  computed: {
    ...mapGetters({
      getToken: "session/getToken",
      getUser: "session/getUser",
      getProfil: "profil/getUserProfil",
      getLocation: "profil/getUserLocation",
      getTags: "tags/getTags"
    }),
    age() {
      return moment().diff(this.getProfil.birthdate, "years");
      //const isLegal = (age >= 18);
    },
    lat() {
        return Number(JSON.parse(this.getLocation.geo).ll[0]);
    },
    lng() {
      return Number(JSON.parse(this.getLocation.geo).ll[1]);
    }
  },
  methods: {

    confirmDelete() {
      const confirm = window.confirm("are you sure ? ");
      if (!confirm) return;

      this.deleteUser();
    },
    logoutEvent() {
      this.$socket.emit("logout", this.getUser);
    },
    async logout() {
      await this.logoutEvent();
      const token = localStorage.getItem("token");
      if (token) localStorage.removeItem("token");
      const token_exp = localStorage.getItem("token_exp");
      if (token_exp) localStorage.removeItem("token_exp");
      this.clearAuth();
      this.clearUser();
      this.clearProfil();
      this.setMessage("Your account is deleted");
      this.setSuccess(true);
      this.setVisibility(true);
      this.$router.push("/");
    },
    deleteUser() {
      axios
        .post("user/delete")
        .then(res => {
          if (res.data.success) {
            this.logout();
          } else {
            self.setMessage("There was a problem please try again");
            self.setSuccess(false);
            self.setVisibility(true);
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
    ...mapActions({
      clearAuth: "session/clearSession",
      clearUser: "session/clearUser",
      clearProfil: "profil/clearUserProfil",
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess",
    }),
    getNavigatorLocation() {
      console.log('ok')
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.updatePosition);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
    updatePosition(position) {
      const self = this;
      const location = [position.coords.latitude, position.coords.longitude];

      axios
        .post("user/update-location", { location })
        .then(res => {
          if (res.data.success) {
            self.setMessage("Your location is updated");
            self.setSuccess(true);
            self.setVisibility(true);
          } else {
            self.setMessage("There was a problem please try again");
            self.setSuccess(false);
            self.setVisibility(true);
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
  },
  watch: {
    getProfil(val) {
      if (val) this.completed = val.completed !== null ? val.completed : null;
    }
  },
  async created() {
    await axios.post(`user/profil`);
  }
  // async updated() {
  //             await axios.post(`user/profil`);

  // }
};
</script>

<style>
</style>
