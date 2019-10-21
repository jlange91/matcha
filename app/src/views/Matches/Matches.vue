<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">Possible Matches</h1>
      <filter-form :all_users="users" @filteredArray="updateFilteredArray"></filter-form>
    <div class="flex justify-center">
      <sort-form class="w-full" :all_users="arrayFiltered" @finalArray="updateFinalArray"></sort-form>
    </div>
    <div class=" flex flex-wrap items-center justify-center">
      <pagination :list-data="arrayFinal" :user-likes="likes" @refreshMatchs="refreshMatchs" />
    </div>
  </div>
</template>

<script>
import axios from "../../middleware/axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      users: [],
      likes: [],
      arrayFiltered: [],
      arrayFinal: [],
    };
  },
  async mounted() {
    await this.getAllPossibleMatches();
  },
  methods: {
    async getAllPossibleMatches() {
      await axios
        .post("/matches")
        .then(res => {
          if (res.data.success) {
            this.users = res.data.possible_matches;
          }
        })
        .catch(e => console.log(e));
    },
      updateFinalArray(newValue) {
      this.arrayFinal = newValue;
    },
    updateFilteredArray(newValue) {
      this.arrayFiltered = newValue;
    },
    like(user_id) {
      socket.emit("notif", this.getSessionUserId, user_id, "like");
    },
    refreshMatchs() {
      this.getAllPossibleMatches()
    }
  },
  computed: {
    ...mapGetters({
      getToken: "session/getToken",
      getUser: "session/getUser",
      getSessionUserId: "session/getUserId",
      getProfil: "profil/getUserProfil",
      getLocation: "profil/getUserLocation",
      getTags: "tags/getTags"
    }),
  }
};
</script>
