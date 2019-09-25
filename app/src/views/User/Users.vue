<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">All Users</h1>
    <form class="w-full">
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Search
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
      <!-- <p class="text-red-500 text-xs italic">Please fill out this field.</p> -->
    </div>
    <!-- <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0"> -->
      <!-- <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">

      </label> -->
      <!-- <input class="appearance-none block w-full bg-gray-200 text-gray-700 border mt-6 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"> -->
      <!-- <p class="text-red-500 text-xs italic">Please fill out this field.</p> -->
    <!-- </div> -->
    <!-- <div class="w-full md:w-1/2 px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
        Last Name
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe">
    </div> -->
  </div>

  <div class="flex flex-wrap -mx-3 mb-2">

    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
        Gender
      </label>
      <div class="relative">
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          <option>Male</option>
          <option>Female</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
        Sexual orientation
      </label>
      <div class="relative">
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          <option>Male</option>
          <option>Female</option>
          <option>Bisexual</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>

  </div>
</form>
    <user-card
      @like="like"
      @unlike="unlike"
      v-for="user in sortedArray"
      :key="user.id"
      :user="user"
      :liked="likes"
    />
  </div>
</template>

<script>
import axios from "../../middleware/axios";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.getAllUsers();
  },
  data() {
    return {
      all_users: [],
      likes: []
    };
  },
  computed: {
    ...mapGetters({
      getUserLocation: 'profil/getUserLocation',
      getTags: 'tags/getTags',
    }),
    sortedArray() {
      const location = this.getUserLocation
      const tags = this.getTags

      const sortByAge = (a, b) => {
        let ageA = moment().diff(a.birthdate, "years"),
            ageB = moment().diff(b.birthdate, "years");
        if (ageA < ageB)
          return -1
        if (ageA > ageB)
          return 1
        return 0
      }

      const sortByLocation = (a, b) => {
        let distanceA = Math.sqrt(Math.pow(a.lat - location.lat, 2) + Math.pow(a.lng - location.lng, 2)) * 111.32
        let distanceB = Math.sqrt(Math.pow(b.lat - location.lat, 2) + Math.pow(b.lng - location.lng, 2)) * 111.32
        if (distanceA < distanceB)
          return -1
        if (distanceA > distanceB)
          return 1
        return 0
      }

      // in progress
      function sortByPopularity(a, b) {
      }

      function sortByTags(a, b) {
        console.log(user)
        return 0
      }

      return this.all_users.sort(sortByTags);
    }
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

  }
};
</script>
