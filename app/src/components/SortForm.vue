<template>
  <ul class="flex border-b justify-center">
    <li class="-mb-px mr-1">
      <button :class="setSortButtonCss(1)" @click="setActiveSort(1)">Age<span v-html="setSvgButton(1)"></span></button>
    </li>
    <li class="-mb-px mr-1">
      <button :class="setSortButtonCss(2)" @click="setActiveSort(2)">Location<span v-html="setSvgButton(2)"></span></button>
    </li>
    <li class="-mb-px mr-1">
      <button :class="setSortButtonCss(3)" @click="setActiveSort(3)">Tags<span v-html="setSvgButton(3)"></span></button>
    </li>
    <li class="-mb-px mr-1">
      <button :class="setSortButtonCss(4)" @click="setActiveSort(4)">Popularity<span v-html="setSvgButton(4)"></span></button>
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
      sortStates: ['none', 'descending', 'ascending'],
      currentSortState: 0,
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
      if (this.currentSortState == 0)
        return this.all_users.slice(0)
      var ret = this.all_users.slice(0)

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
          ret = ret.sort(sortByAge)
        case 2:
          ret = ret.sort(sortByLocation)
        case 3:
          ret = ret.sort(sortByTags)
        case 4:
          ret = ret.sort(sortByPopularity)
      }
      if (this.currentSortState == 2)
        ret = ret.reverse()
      return ret
    }
  },
  methods: {
    setActiveSort: function (id) {
      if (this.activeSort == id) {
        this.currentSortState = (this.currentSortState == this.sortStates.length - 1) ? 0 : this.currentSortState + 1
      }
      else {
        this.currentSortState = 1
        this.activeSort = id
      }
    },
    setSortButtonCss: function (id) {
      if (this.activeSort == id)
        return this.activeCss
      else
        return this.disableCss
    },
    setSvgButton: function (id) {
      if (this.activeSort == id) {
        switch (this.currentSortState) {
          case 1:
            return '<svg class="fill-current h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10V2h6v8h5l-8 8-8-8h5z"/></svg>'
          case 2:
            return '<svg class="fill-current h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10v8h6v-8h5l-8-8-8 8h5z"/></svg>'
          default:
            return ''
        }
      }
    },
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
