<template>
  <div>
    <div class="inline">
      <input class="float-left" type="checkbox">
      <vue-slider class="ml-6" v-model="filterAge" :enable-cross="false" :min="0" :max="100"></vue-slider>
    </div>
    <div class="inline">
      <input class="float-left" type="checkbox">
      <vue-slider class="ml-6" v-model="filterLocation" :enable-cross="false" :min="0" :max="1000"></vue-slider>
    </div>
    <div class="w-full px-3 mb-6">
      <p class="text-gray-900 text-sm py-2">Select or create some tags</p>
      <v-select
        v-model="filterTags"
        @input="updateTags"
        :close-on-select="true"
        :push-tags="true"
        :taggable="true"
        :multiple="true"
      ></v-select>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: "FiltersForm",
  props: {
    all_users: {
      type: Array,
      required: true
    }
  },
  components: {
    VueSlider
  },
  mounted() {
  },
  data() {
    return {
      user_tags: [],
      user_location: [],
      filterAge: [0, 100],
      filterLocation: 100,
      filterTags: []
    };
  },
  computed: {
    ...mapGetters({
      getUserLocation: 'profil/getUserLocation',
      getTags: 'tags/getTags',
    }),
    filteredArray() {
    //   const tags = ["HTTP overriding", "Syrian Arab Republic a"]
    //
    //   const sortByAge = (a, b) => {
    //     let ageA = moment().diff(a.birthdate, "years"),
    //         ageB = moment().diff(b.birthdate, "years");
    //     if (ageA < ageB)
    //       return -1
    //     if (ageA > ageB)
    //       return 1
    //     return 0
    //   }
    //
    //   const sortByLocation = (a, b) => {
    //     if (!this.user_location)
    //       return 0
    //     let distanceA = Math.sqrt(Math.pow(a.lat - this.user_location.lat, 2) + Math.pow(a.lng - this.user_location.lng, 2)) * 111.32
    //     let distanceB = Math.sqrt(Math.pow(b.lat - this.user_location.lat, 2) + Math.pow(b.lng - this.user_location.lng, 2)) * 111.32
    //     if (distanceA < distanceB)
    //       return -1
    //     if (distanceA > distanceB)
    //       return 1
    //     return 0
    //   }
    //
    //   const sortByTags = (a, b) => {
    //     if (!this.user_tags)
    //       return 0
    //     let matchTagsA = 0,
    //         matchTagsB = 0
    //
    //     this.user_tags.forEach( (tag) => {
    //       if (a.user_tags && a.user_tags.includes(tag.name))
    //         matchTagsA++
    //     })
    //
    //     this.user_tags.forEach( (tag) => {
    //       if (b.user_tags && b.user_tags.includes(tag.name))
    //         matchTagsB++
    //     })
    //     if (matchTagsA < matchTagsB)
    //       return 1
    //     if (matchTagsA > matchTagsB)
    //       return -1
    //     return 0
    //   }

      // in progress
      // function sortByPopularity(a, b) {
      // }

      const filterByAge = (user) => {
        let age = moment().diff(user.birthdate, "years")

        return (age >= this.filterAge[0] && age <= this.filterAge[1]) ? true : false
      }

      const filterByLocation = (user, max) => {
        let distance = Math.sqrt(Math.pow(user.lat - this.user_location.lat, 2) + Math.pow(user.lng - this.user_location.lng, 2)) * 111.32

        return (distance === NaN || distance <= this.filterLocation) ? true : false;
      }

      const filterByTags = (user) => {
        let count = 0;
        if (!user.user_tags)
          user.user_tags = []
          this.filterTags.forEach((val) => {
            if (user.user_tags.includes(val))
              count++
          })
          // if (count == tags.length)
          //   console.log(user.user_tags)

        return (count == this.filterTags.length) ? true : false
      }

      return this.all_users.filter(filterByTags)
      // return this.all_users.sort(sortByAge)
      // return this.all_users.filter(filterByTags)
    }
  },
  methods: {
    updateValue: function () {
      console.log(this.value)
      this.$emit('filteredArray', this.age)
    },
    updateTags(val) {
      this.filterTags = val;
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
