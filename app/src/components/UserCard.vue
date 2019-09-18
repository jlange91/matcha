<template >
  <div v-show="this.$route.path === '/matches' ? !isLiked : 'true'" class="max-w-sm rounded overflow-hidden shadow-lg mx-auto my-8">
    <img
      v-if="user.avatar != null"
      :src="'/api/v1/images/get/' + user.avatar"
      :alt="user.username"
      class="rounded-full w-32 h-32 mx-auto"
    />
    <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32" />
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2 text-center">
        <router-link :to="`/user/${user.username}`">
          {{user.username}}
        </router-link>
        <!-- <p @click.prevent="goToUserProfil(user.username)">{{user.username}}</p> -->
      </div>
    </div>
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
      class="focus:outline-none hover:bg-teal-700 bg-teal-600 text-white uppercase w-full py-2 font-semibold"
    >{{buttonText}}</button>

    <!-- <user-profil-modal :modal-name="user.username" :user="user" /> -->
  </div>
</template>

<script>
import axios from "../middleware/axios";
import { mapGetters, mapActions } from "vuex";

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
  },
  computed: {
    ...mapGetters({
      getLogged: 'session/getLogged'
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

    if (this.user.user_tags) this.user_tags = this.user.user_tags.split(",");
  }
};
</script>
