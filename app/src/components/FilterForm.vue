<template>
  <div>
    Filter by age range<br/>
    <div class="inline">
      <input class="float-left" type="checkbox" @click="setActiveFilter(1)">
      <vue-slider class="ml-6" v-model="filterAge" :enable-cross="false" :min="0" :max="100" :disabled="disabledFilter(1)"></vue-slider>
    </div>
    Filter by popularity range<br/>
    <div class="inline">
      <input class="float-left" type="checkbox" @click="setActiveFilter(2)">
      <vue-slider class="ml-6" v-model="filterPopularity" :enable-cross="false" :min="0" :max="maxFameRating" :disabled="disabledFilter(2)"></vue-slider>
    </div>
    <div v-if="user_location.lat && user_location.lng">
      Filter by max distance in km<br/>
      <div class="inline">
        <input class="float-left" type="checkbox" @click="setActiveFilter(3)">
        <vue-slider class="ml-6" v-model="filterLocation" :enable-cross="false" :min="0" :max="1000" :disabled="disabledFilter(3)"></vue-slider>
      </div>
    </div>
    <br/>Filter by tags<br/>
    <div class="w-full px-3 mb-6">
      <p class="text-gray-900 text-sm py-2">Select or create some tags</p>
      <v-select
        v-model="filterTags"
        @input="updateTags"
        :close-on-select="true"
        :push-tags="true"
        :taggable="true"
        :multiple="true" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import axios from "../middleware/axios";

export default {
  name: "FilterForm",
  props: {
    all_users: {
      type: Array,
      required: true
    }
  },
  components: {
    VueSlider
  },
  data() {
    return {
      user_tags: [],
      user_location: [],
      filterAge: [0, 100],
      filterPopularity: [0, 1],
      maxFameRating: 1,
      filterLocation: 100,
      filterTags: [],
      activeFilter: []
    };
  },
  mounted() {
    axios.get("/user/getMaxFameRating").then(res => {
      if (res.data.success && res.data.maxFameRating) {
        this.maxFameRating = res.data.maxFameRating
        this.filterPopularity[1] = res.data.maxFameRating
      }
    }).catch(e => console.log(e));
  },
  computed: {
    ...mapGetters({
      getUserLocation: 'profil/getUserLocation',
      getTags: 'tags/getTags',
    }),
    filteredArray() {
      var ret = this.all_users

      const filterByAge = (user) => {
        let age = moment().diff(user.birthdate, "years")

        return (age >= this.filterAge[0] && age <= this.filterAge[1]) ? true : false
      }

      const filterByLocation = (user, max) => {
        let distance = Math.sqrt(Math.pow(user.lat - this.user_location.lat, 2) + Math.pow(user.lng - this.user_location.lng, 2)) * 111.32

        return (distance === NaN || distance <= this.filterLocation) ? true : false;
      }

      const filterByTags = (user) => {
        var count = 0;
        var tags = (typeof(user.user_tags) == 'string') ? user.user_tags.split(',') : [];

        this.filterTags.forEach((val) => {
          if (tags.includes(val) === true)
            count++
        })
        return (count == this.filterTags.length) ? true : false
      }

      const filterByPopularity = (user) => {
        return (user.fame_rating >= this.filterPopularity[0] && user.fame_rating <= this.filterPopularity[1]) ? true : false
      }

      if (this.filterTags.length)
        ret = ret.filter(filterByTags)
      if (this.activeFilter.includes(1))
        ret = ret.filter(filterByAge)
      if (this.activeFilter.includes(2))
        ret = ret.filter(filterByPopularity)
      if (this.activeFilter.includes(3))
        ret = ret.filter(filterByLocation)
      return ret
    }
  },
  methods: {
    updateTags(val) {
      this.filterTags = val;
    },
    disabledFilter(id) {
      return (this.activeFilter.includes(id)) ? false : true
    },
    setActiveFilter(id) {
      if (this.activeFilter.includes(id))
        this.activeFilter = this.activeFilter.filter((elem) => elem !== id)
      else
        this.activeFilter.push(id)
    }
  },
  watch: {
    getTags(newValue, oldValue) {
      this.user_tags = newValue
    },
    getUserLocation(newValue, oldValue) {
      this.user_location = newValue
    },
    filteredArray(newValue, oldValue) {
      this.$emit('filteredArray', newValue)
    }
  }
};
</script>
