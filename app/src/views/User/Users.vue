<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">All Users</h1>
    <form class="w-full" @submit.prevent="">

      <filter-form :all_users="all_users" @filteredArray="updateFilteredArray"></filter-form>
      <sort-form :all_users="filteredArray" @filteredArray="updateFinalArray"></sort-form>

    </form>

    <user-card
      @like="like"
      @unlike="unlike"
      v-for="user in finalArray"
      :key="user.id"
      :user="user"
      :liked="likes"
    />
  </div>
</template>

<script>
import axios from "../../middleware/axios";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  components: {
    VueSlider
  },
  mounted() {
    this.getAllUsers();
  },
  data() {
    return {
      all_users: [],
      filteredArray: [],
      finalArray: [],
      likes: []
    };
  },
  methods: {
    getAllUsers() {
      axios.post("/users").then(res => {
        this.all_users = res.data.users;
        this.likes = res.data.likes;
      });
    },
    like(user_id) {
      this.likes.push({ liked_id: user_id });
    },
    unlike(user_id) {
      this.arrayRemove(user_id);
    },
    arrayRemove(value) {
      const ret = this.likes.filter(function(ele) {
        return ele.liked_id != value;
      });
      this.likes = ret
    },
    updateFinalArray(newValue) {
      this.finalArray = newValue;
    },
    updateFilteredArray(newValue) {
      this.filteredArray = newValue;
    }
  }
};
</script>
