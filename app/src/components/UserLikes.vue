<template>
  <div class="mt-8 p-4 container mx-auto min-w-sm max-w-lg rounded bg-white shadow">
      user who likes you
      <ul class="my-4">
        <li v-for="(user, i) in user_likes" :key="i">
            <router-link class="text-teal-600 cursor-pointer" :to="`/user/${user.username}`">
              {{user.username}}
            </router-link>
        </li>
      </ul>
  </div>
</template>

<script>
import axios from "../middleware/axios";

export default {
  data() {
    return {
      user_likes: []
    }
  },
  mounted() {
    this.getUserLikes()
  },
  methods: {
     getUserLikes() {
      axios.post("/user/likes").then((res) => {
        if(res.data.success) {
          this.user_likes = res.data.user_likes
        }
      });
    }
  }
}
</script>