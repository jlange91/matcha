<template>
  <div class="h-48 lg:h-64 shadow" style="overflow: hidden;width: 98%;" :id="`google-map-${id}`"></div>
</template>

<script>
export default {
props: {
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    id: {
      type: Number,
      required: false,
      default: 0
    }
},
  mounted() {
      const location = {
        lat: this.lat,
        lng: this.lng
      };
      const map = new google.maps.Map(document.getElementById(`google-map-${this.id}`), {
        zoom: 13,
        center: location,
         disableDefaultUI: true,
        scrollwheel: false
      });
      const marker = new google.maps.Marker({
        position: location,
        map: map })
  },

}
</script>

<style>
</style>
