<template >
  <div v-show="this.$route.path === '/matches' ? !isLiked : 'true'" class="max-w-sm min-w-1/3 rounded overflow-hidden my-8">
    <img
      v-if="user.avatar != null"
      :src="'/api/v1/images/get/' + user.avatar"
      :alt="user.username"
      class="rounded-full w-32 h-32 mx-auto"
    />
    <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32" />
    <div class="py-4">
      <div class="font-bold text-xl mb-2 text-center">
        <router-link :to="`/user/${user.username}`">
          {{user.username}}
        </router-link>
        <!-- <p @click.prevent="goToUserProfil(user.username)">{{user.username}}</p> -->
      </div>
      <p>{{age}} ans</p>
      <p>{{user.gender}}</p>
      <p>{{user.fame_rating}} points</p>
      <p v-if="distance != null">{{distance}} KM</p>
       <!-- <user-profil-map :id="user.id" :lat="user.lat" :lng="user.lng"/> -->
    </div>
    <!-- <fame-rating class="container" :fame_rating="user.fame_rating"/> -->
    <div class="px-6 py-4">
      <span
        v-for="(tag, i) in user_tags"
        :key="i"
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
      >{{tag}}</span>
    </div>
    <button
      v-if="getLogged"
      @click="parseLike(user)"
      class="focus:outline-none hover:bg-teal-700 bg-teal-600 text-white uppercase w-full py-2 font-semibold w-full"
    >{{buttonText}}</button>

    <!-- <user-profil-modal :modal-name="user.username" :user="user" /> -->
  </div>
</template>

<script>
import axios from "../middleware/axios";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "UserCard",
  props: {
    user: {
      type: Object,
      required: true
    },
    liked: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      user_tags: [],
      open_modal: false,
      selected_user: null
    };
  },
  methods: {
    ...mapActions({
      setUserProfilId: "viewing/setUserProfilId",
      clearUserProfilId: "viewing/clearUserProfilId"
    }),
    openUserProfilModal(user) {
      this.clearUserProfilId()
      this.setUserProfilId(user.id)
    },
    goToUserProfil(username) {
      this.$router.push(`/user/${username}`)
    },
    parseLike(user) {
      if(this.isLiked) {
        if (this.$route.path === '/matches')
          this.unlikeUser(user.user_id)
        else
          this.unlikeUser(user.id)
      }
      else {
        if (this.$route.path === '/matches')
          this.likeUser(user.user_id)
        else
          this.likeUser(user.id)
      }
    },
    unlikeUser(user_id) {
      axios.post("likes/destroy", { liked_id: user_id }).then(res => {
        if (res.data.success) this.$emit("unlike", user_id);
      });
    },
    likeUser(user_id) {
      axios.post("likes", { liked_id: user_id }).then(res => {
        if (res.data.success) this.$emit("like", user_id);
      });
    },
    userTags() {
      if (this.user_tags.length) {
        this.user_tags.forEach((tag, i) => {
            if (i <= 3)
              return this.user_tags = this.user_tags.slice(0, 3)
            else if (i === 3) {
              this.user_tags = this.user_tags.slice(0, 3)
              return this.user_tags.push("...")
            }
            else {
              this.user_tags = this.user_tags.slice(0, 3)
              return this.user_tags.push("...")
            }
        })
      }
    },
  },
  computed: {
    distance() {
      if (this.getLogged && this.getUserLocation)
        return Math.round(Math.sqrt(Math.pow(this.user.lat - this.getUserLocation.lat, 2) + Math.pow(this.user.lng - this.getUserLocation.lng, 2)) * 111.32)
      else
        return null
    },
    age() {
      if (this.user && this.user.birthdate)
      return moment().diff(this.user.birthdate, "years");
      //const isLegal = (age >= 18);
    },
    ...mapGetters({
      getLogged: 'session/getLogged',
      getUserLocation: 'profil/getUserLocation'
    }),
    buttonText() {
      return this.isLiked ? "Unlike" : "Like";
    },
    isLiked() {
      if (!this.liked) return;

      const self = this;
      const found = this.liked.find(function(element) {
        if (self.$route.path === '/matches')
          return element.liked_id === self.user.user_id;
        else
          return element.liked_id === self.user.id;
      });

      if (found) return true;
      else return false;
    }
  },
  mounted() {
    this.user_tags = (typeof(this.user.user_tags) == 'string') ?
      this.user.user_tags.split(",") : []
    this.userTags()
  }
};
</script>
