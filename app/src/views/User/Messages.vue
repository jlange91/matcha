<template>
  <div>
  <ul>
    <li v-for="match in matchs" class="px-6 py-4">
      {{ match.user_id }} || {{ match.match_id}}
    </li>
  </ul>
    <button @click="getMatchs" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
      test
    </button>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from "vuex";

  import axios from "../../middleware/axios";

  export default {
    data () {
      return {
        matchs: {}
      }
    },
    mounted() {
      // this.getMatchs();
    },
    methods: {
      getMatchs() {
        axios
          .get("match/get")
          .then(res => this.matchs = res.data.matchs)
          .catch(e => console.log("e ", e));
      }
    },
    computed: {
    },
  };
</script>
