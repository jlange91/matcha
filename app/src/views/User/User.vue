<template>
  <div class="mt-8 p-4 container mx-auto max-w-sm rounded bg-white shadow">
          <div>
            <img v-if="getUserData.user_info.avatar != null" :src="'/api/v1/images/get/' + getUserData.user_info.avatar" :alt="getUserData.user_info.username" class="rounded-full w-32 h-32">
            <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32">
          </div>
          <div v-if="this.getLogged">
            <div class="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">
              {{ this.status }}
            </div>
          </div>
          <fame-rating :fame_rating="getUserData.user_info.fame_rating"/>
          <div>
            Username: {{getUserData.user_info.username}}
            <!-- <br>
            Email: {{getUserData.user_info.email}} -->
            <br>
            First name: {{getUserData.user_info.first_name}}
            <br>
            Last name: {{getUserData.user_info.last_name}}
          </div>
          <button @click="show = true" class="mt-4 bg-teal-600 text-white font-semibold py-2 px-4 rounded focus:outline-none">
            show images
          </button>
          <user-image-modal v-show="show" @close="show = false" :show="show" :user-id="getUserData.user_info.id" />
          <div class="mt-8 flex flex-wrap" v-show="getUserData.user_info.completed">
            Age: {{this.userBirthDate}}
            <br>
            Gender: {{getUserData.user_info.gender}}
            <br>
            Sexual preference: {{getUserData.user_info.sexual_orientation}}
            <br>
            <p class="inline-flex w-full">Biography:
              <span v-html="getUserData.user_info.biography"></span></p>
          </div>
           <div class="mt-8 flex flex-wrap">
            <span
              v-for="(tag, i) in getUserData.tags"
              :key="i"
              class="m-2 bg-teal-100 rounded-full py-1 px-4 text-teal-700"
            >#{{tag.name}}</span>
          </div>
          <div class="mt-8">

            <user-profil-map :id="getUserData.user_info.id" :lat="getUserData.user_info.lat" :lng="getUserData.user_info.lng"/>
          </div>
          <button
      v-if="getLogged"
      @click="parseLike(getUserData.user_info)"
      class="focus:outline-none hover:bg-teal-700 bg-teal-600 text-white uppercase w-full py-2 font-semibold"
    >{{buttonText}}</button>

        <button  v-if="getLogged" @click="spam(getUserData.user_info)" class="mt-8 bg-red-600 text-white hover:bg-red-400 px-4 py-2 rounded font-semibold cursor-pointer">
          Spam
        </button>
        </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "../../middleware/axios";
import { getUserSpam } from '../../store/modules/session/getters';
import socket from "../../middleware/socket-instance";

export default {
  data() {
    return {
       likes: [],
       logged: false,
       status: 'Not Connected',
       show: false
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.getUserData.user_info.id === this.getSessionUserId)
        this.$router.push('/')
      this.userLikes()
      this.refreshStatus()
      if (this.getLogged) {
        if (this.getUserSpam == 0)
          this.addViewToUser()
      }
    }, 500)
  },
  methods: {
    refreshStatus() {
      axios
        .post("logged_user", { user_id: this.getUserData.user_info.id })
        .then(res => {
          if (res.data.success) {
            if (res.data.is_logged.last_seen === true)
              this.status = 'Connected'
            else
            {
              let date = res.data.is_logged.last_seen
              let now = new Date();
              let old = new Date(date);

              if (!date) return ;
              date =
                old.getFullYear() < now.getFullYear() ||
                old.getMonth() < now.getMonth() ||
                old.getDate() < now.getDate()
                  ? date.split(" ")[0]
                  : date.split(" ")[1];

                this.status = 'Last seen at ' + date
            }
          }
        })
        .catch(error => {
          console.log(error)
        });
    },
    addViewToUser() {

      socket.emit("notif", this.getSessionUserId, this.getUserData.user_info.id, "view");

      axios.post("view", { viewed_id: this.getUserData.user_info.id }).then().catch(e => console.log(e));
    },
    spam(user) {
      axios.post("spam", { spam_id: user.id }).then((res) => {
        if(res.data.success) {
      this.setMessage("Your signaled this user as spam");
        this.setSuccess(true);
        this.setVisibility(true);
        }
      }).catch(e => console.log(e));
    },
    parseLike(user) {
      if(this.isLiked) {
        // if (this.$route.path === '/matches')
        //   this.unlikeUser(user.user_id)
        // else
          this.unlikeUser(user.id)
      }
      else {
        // if (this.$route.path === '/matches')
        //   this.likeUser(user.user_id)
        // else
          this.likeUser(user.id)
      }
    },
    unlikeUser(user_id) {

      socket.emit("notif", this.getSessionUserId, user_id, "unlike");

      axios.post("likes/destroy", { liked_id: user_id }).then(res => {
        if (res.data.success) this.arrayRemove(user_id);
      });
    },
    likeUser(user_id) {
      socket.emit("notif", this.getSessionUserId, user_id, "like");
      axios.post("likes", { liked_id: user_id }).then(res => {
        if (res.data.success)  this.likes.push({ liked_id: user_id });
      });
    },
     userLikes() {
      if (this.getLogged) {
        axios.post("/users").then(res => {
          this.likes = res.data.likes;
        });
      }
    },
     arrayRemove(value) {
      const ret = this.likes.filter(function(ele) {
        return ele.liked_id != value;
      });
      this.likes = ret
    },
    ...mapActions({
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess",
    }),
  },
  computed: {
    ...mapGetters({
      getUserData: 'user/getData',
      getLogged: 'session/getLogged',
      getSessionUserId: 'session/getUserId',
      getUserSpam: 'session/getUserSpam'
    }),
    buttonText() {
      return this.isLiked ? "Unlike" : "Like";
    },
    userBirthDate() {
      const today = new Date();
      const birthDate = new Date(this.getUserData.user_info.birthdate);
      const m = today.getMonth() - birthDate.getMonth();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
    },
    isLiked() {
      if (!this.likes) return;
      const self = this;
      const found = this.likes.find(function(element) {
          return element.liked_id === self.getUserData.user_info.id;
      });

      if (found) return true;
      else return false;
    }
  }
}
</script>
