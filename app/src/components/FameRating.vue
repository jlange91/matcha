<template>
  <div>
    <p class="my-4">{{iAmFamous}} Points</p>
  </div>
</template>

<script>
export default {
  name: "FameRating",
  props: {
    fame_rating: {
      type: Number,
      required: true
    }
  },
  computed: {
    iAmFamous() {
      return this.fame_rating >= 0 ? this.fame_rating : 0
    }
  }
};
</script>