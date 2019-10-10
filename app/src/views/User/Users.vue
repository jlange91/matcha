<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">All Users</h1>
      <filter-form :all_users="all_users" @filteredArray="updateFilteredArray"></filter-form>
    <div class="flex justify-center">
      <sort-form class="w-full" :all_users="filteredArray" @filteredArray="updateFinalArray"></sort-form>
    </div>
    <pagination :list-data="finalArray" :user-likes="likes"/>
      <!-- <user-card
      @like="like"
      @unlike="unlike"
      v-for="user in finalArray"
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
   
    updateFinalArray(newValue) {
      this.finalArray = newValue;
    },
    updateFilteredArray(newValue) {
      this.filteredArray = newValue;
    }
  }
};
</script>
