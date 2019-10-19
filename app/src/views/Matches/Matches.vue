<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">Possible Matches</h1>
      <filter-form :all_users="users" @filteredArray="updateFilteredArray"></filter-form>
    <div class="flex justify-center">
      <sort-form class="w-full" :all_users="arrayFiltered" @finalArray="updateFinalArray"></sort-form>
    </div>
    <div class=" flex flex-wrap items-center justify-center">
      <pagination :list-data="arrayFinal" :user-likes="likes"/>
    <!-- <user-card
      class=""
      v-for="user in filtered_users"
      @like="like"
      @unlike="unlike"
      :key="user.id"
      :user="user"
      :liked="likes"
    /> -->


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
            this.likes = res.data.user_likes;
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
      this.getAllPossibleMatches()
      socket.emit("notif", this.getSessionUserId, user_id, "like");
      // this.likes.push({ liked_id: user_id });
      // this.removeUserFromArray(user_id);
    },
    // unlike(user_id) {
    //   socket.emit("notif", this.getSessionUserId, user_id, "unlike");
    //   this.removeLikeFromArray(user_id);
    // },
    // removeLikeFromArray(value) {
    //   const ret = this.likes.filter(function(ele) {
    //     return ele.liked_id != value;
    //   });
    //   this.likes = ret;
    // },
    // removeUserFromArray(value) {
    //   const ret = this.users.filter(function(ele) {
    //     return ele.id != value;
    //   });
    //   this.users = ret;
    // },

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
