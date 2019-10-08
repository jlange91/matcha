<template>
  <ul class="flex border-b">
  <li class="-mb-px mr-1">
    <a :class="activeCss">Active<svg class="fill-current h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10v8h6v-8h5l-8-8-8 8h5z"/></svg></a>
  </li>
  <li class="mr-1">
    <a :class="disableCss">Tab</a>
  </li>
  <li class="mr-1">
    <a class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold">Tab</a>
  </li>
</ul>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: "SortForm",
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
      activeSort: 0,
      sortStates: ['none', 'ascending', 'descending'],
      activeCss: "bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold flex items-center justify-center",
      disableCss: "bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
    };
  },
  computed: {
    ...mapGetters({
      getUserLocation: 'profil/getUserLocation',
      getTags: 'tags/getTags',
    }),
    filteredArray() {
      var ret = this.all_users

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
        if (!this.user_location)
          return 0
        let distanceA = Math.sqrt(Math.pow(a.lat - this.user_location.lat, 2) + Math.pow(a.lng - this.user_location.lng, 2)) * 111.32
        let distanceB = Math.sqrt(Math.pow(b.lat - this.user_location.lat, 2) + Math.pow(b.lng - this.user_location.lng, 2)) * 111.32
        if (distanceA < distanceB)
          return -1
        if (distanceA > distanceB)
          return 1
        return 0
      }

      const sortByTags = (a, b) => {
        if (!this.user_tags)
          return 0
        let matchTagsA = 0,
            matchTagsB = 0

        this.user_tags.forEach( (tag) => {
          if (a.user_tags && a.user_tags.includes(tag.name))
            matchTagsA++
        })

        this.user_tags.forEach( (tag) => {
          if (b.user_tags && b.user_tags.includes(tag.name))
            matchTagsB++
        })
        if (matchTagsA < matchTagsB)
          return 1
        if (matchTagsA > matchTagsB)
          return -1
        return 0
      }

      // in progress
      function sortByPopularity(a, b) {
      }


      switch (this.activeSort) {
        case 1:
          return ret.sort(sortByAge)
        case 2:
          return ret.sort(sortByLocation)
        case 3:
          return ret.sort(sortByTags)
        case 4:
          return ret.sort(sortByPopularity)
        default:
          return ret

      }
      // return this.all_users.filter(filterByTags)
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
    },
    disabledFilter(id) {
      return (id == this.activeSort) ? false : true
    },
    checkedFilter(id) {
      return (id == this.activeSort) ? true : false
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
