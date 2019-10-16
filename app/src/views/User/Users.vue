<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">All Users</h1>
    <filter-form :all_users="all_users" @filteredArray="updateFilteredArray"></filter-form>

    <div class="flex justify-center">
      <sort-form class="w-full" :all_users="arrayFiltered" @finalArray="updateFinalArray"></sort-form>
    </div>
    <pagination :list-data="arrayFinal" :user-likes="likes"/>
    <!-- <user-card
      @like="like"
      @unlike="unlike"
      v-for="user in arrayFinal"
      :key="user.id"
      :user="user"
      :liked="likes"
    /> -->
  </div>
</template>

<script>
import axios from "../../middleware/axios";
import Pagination from '../../../src/components/Pagination'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  components: {
    VueSlider,
    Pagination
  },
  mounted() {
    this.getAllUsers();
  },
  data() {
    return {
      all_users: [],
      arrayFiltered: [],
      arrayFinal: [],
      likes: []
    };
  },
  methods: {
    getAllUsers() {
      axios.post("/users").then(res => {
        this.all_users = res.data.users;
        this.likes = res.data.likes;
      }).catch(e => console.log(e));
    },
    updateFinalArray(newValue) {
      this.arrayFinal = newValue;
    },
    updateFilteredArray(newValue) {
      this.arrayFiltered = newValue;
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
    }
  }
  // watch: {
  //   arrayFiltered(newValue, oldValue) {
  //     console.log("bite")
  //   }
  // }
};
</script>
