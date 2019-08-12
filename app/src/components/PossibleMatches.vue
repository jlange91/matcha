<template>
  <div
    class="container bg-white mx-auto w-full max-w-xl px-3 py-4 shadow rounded border-t-4 border-teal-500 mt-12"
  > 
        <div v-if="!possible_matches.length">
            <p>
              You have no matches please create some tags
            </p>
        </div>
        <div v-else v-for="matches in possible_matches" :key="matches.id" class="mx-auto w-full flex flex-col justify-between items-center max-w-sm">
            <img :src="'/api/v1/images/get/' + matches.avatar" alt="" class="rounded-full w-32 h-32">
            <p class="my-4 text-gray-700 uppercase font-semibold">
              {{matches.username}}
            </p>
            <button @click="likeUser(matches.id)" class="bg-teal-600 text-white p-1 rounded focus:outline-none">
                Like
            </button>
        </div>
  </div>
</template>

<script>
import axios from "../middleware/axios";

export default {
  name: "PossibleMatches",
  mounted() {
    this.getMatches();
  },
  data() {
      return {
        possible_matches: []
      }
  },
  methods: {
    likeUser(user_id) {
      axios.post('/likes', {liked_id: user_id}).then((res) => {
           console.log(res.data)
      });
    },
    getMatches() {
      axios.post("/matches").then((res) => {
            res.data.possible_matches.forEach(element => {
                this.possible_matches.push(element)
            });
      });
    }
  }
};
</script>