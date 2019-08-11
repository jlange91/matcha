<template>
  <div
    class="container bg-white mx-auto w-full max-w-xl px-3 py-4 shadow rounded border-t-4 border-teal-500 mt-12"
  >
        <div v-for="matches in possible_matches" :key="matches.id" class="w-full flex justify-between items-center">
            <img :src="'/api/v1/images/get/' + matches.avatar" alt="" class="rounded-full w-32 h-32">
            {{matches.username}}
            <button class="bg-teal-600 text-white p-1 rounded">
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