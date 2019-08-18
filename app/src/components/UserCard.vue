<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg mx-auto my-8">
    <img
      v-if="user.avatar != null"
      :src="'/api/v1/images/get/' + user.avatar"
      :alt="user.username"
      class="rounded-full w-32 h-32 mx-auto"
    />
    <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32" />
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2 text-center">
        <p>{{user.username}}</p>
      </div>
    </div>
    <div class="px-6 py-4">
      <span
        v-for="tag in user_tags"
        :key="tag"
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
      >{{tag}}</span>
    </div>
    <button
      @click="isLiked ? unlikeUser(user.id) :  likeUser(user.id) "
      class="focus:outline-none hover:bg-teal-700 bg-teal-600 text-white uppercase w-full py-2 font-semibold"
    >{{buttonText}}</button>
  </div>
</template>

<script>
import axios from "../middleware/axios";
import { mapGetters } from "vuex";

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
      user_tags: []
    };
  },
  methods: {
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
    isMatch() {
      
      console.log(
        "matched user " +
          this.user.id +
          " " +
          this.user.gender +
          " looking for " +
          this.user.sexual_orientation
      );
      
      const current_user_gender = this.getProfil.gender
      const current_user_sexual_orientation = this.getProfil.sexual_orientation
      const matched_user_gender = this.user.gender
      const matched_user_sexual_orientation = this.user.sexual_orientation
     
        console.log(
          "matched user " +
            this.getProfil.user_id +
            " " +
            current_user_gender +
            " looking for " +
            current_user_sexual_orientation
      );
    
      if (current_user_gender === 'male' && current_user_sexual_orientation === 'female') {
          console.log(matched_user_gender)
          console.log(current_user_gender)
      }
    
    }
  },
  computed: {
    ...mapGetters({
      getToken: "session/getToken",
      getUser: "session/getUser",
      getProfil: "profil/getUserProfil",
      getLocation: "profil/getUserLocation",
      getTags: "tags/getTags"
    }),
    buttonText() {
      return this.isLiked ? "Unlike" : "Like";
    },
    isLiked() {
      if (!this.liked) return;

      const self = this;
      const found = this.liked.find(function(element) {
        return element.liked_id === self.user.id;
      });

      if (found) return true;
      else return false;
    }
  },
  mounted() {
    // console.log(this.user);
     this.isMatch();
    if (this.user.user_tags) this.user_tags = this.user.user_tags.split(",");
  }
}
</script>