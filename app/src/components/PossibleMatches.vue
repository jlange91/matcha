<template>
  <div
    class="container bg-white mx-auto w-full max-w-xl px-3 py-4 shadow rounded border-t-4 border-teal-500 mt-12"
  > 
        <div v-if="!possible_matches.length">
            <p>
              You have no matches please create some tags
            </p>
        </div>
         <user-card v-else
      
      v-for="user in possible_matches"
      :key="user.id"
      :user="user"
    
    />
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