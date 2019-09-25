<template>
  <div class="mt-8 p-4 container mx-auto min-w-sm max-w-lg rounded bg-white shadow">
      user likes
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
      axios.get("/likes").then((res) => {
            // res.data.possible_matches.forEach(element => {
            //     this.possible_matches.push(element)
            // });
      });
    }
  }
}
</script>