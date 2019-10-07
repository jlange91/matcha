<template>
  <div>
    <div class="shadow w-full bg-gray-300 my-4">
      <div
        class="bg-blue-600 text-xs leading-none py-1 text-center text-white rounded"
        :style="width"
      >{{fuckMeImFamous}}%</div>
    </div>
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
    fuckMeImFamous() {
      return this.fame_rating >= 100 ? 100 :  this.fame_rating
    },
    width() {
      return `width: ${this.fuckMeImFamous}%`
    }
  }
};
</script>