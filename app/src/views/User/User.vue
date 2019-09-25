<template>
  <div class="mt-8 p-4 container mx-auto min-w-sm max-w-lg rounded bg-white shadow">
          <div>
            <img v-if="getUserData.user_info.avatar != null" :src="'/api/v1/images/get/' + getUserData.user_info.avatar" :alt="getUserData.user_info.username" class="rounded-full w-32 h-32">
            <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32">
          </div>
          <div>
            Username: {{getUserData.user_info.username}}
            <br>
            Email: {{getUserData.user_info.email}}
            <br>
            First name: {{getUserData.user_info.first_name}}
            <br>
            Last name: {{getUserData.user_info.last_name}}
          </div>

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

            <user-profil-map :lat="getUserData.user_info.lat" :lng="getUserData.user_info.lng"/>
          </div>
          <button
      v-if="getLogged"
      @click="parseLike(getUserData.user_info)"
      class="focus:outline-none hover:bg-teal-700 bg-teal-600 text-white uppercase w-full py-2 font-semibold"
    >{{buttonText}}</button>

        </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "../../middleware/axios";

export default {
  data() {
    return {
       likes: []
    }
  },
  mounted() {
    this.userLikes()
    if (this.getLogged)
    this.addViewToUser()
  },
  methods: {
    addViewToUser() {
      console.log('add view')
      axios.post("view", { viewed_id: this.getUserData.user_info.id }).then().catch(e => console.log(e));
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
      axios.post("likes/destroy", { liked_id: user_id }).then(res => {
        if (res.data.success) this.arrayRemove(user_id);
      });
    },
    likeUser(user_id) {
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
  },
  computed: {
    ...mapGetters({
      getUserData: 'user/getData',
      getLogged: 'session/getLogged'
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
