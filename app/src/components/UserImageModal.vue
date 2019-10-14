<template>
   <div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
  <div @click="closeModal" class="modal-overlay absolute w-full h-full bg-black opacity-25 top-0 left-0 cursor-pointer"></div>
  <div class="absolute bg-white rounded-sm shadow-lg flex items-center justify-center text-2xl">
    <!-- {{user.username }} 🚀 -->
      <p v-show="message" class="px-4 py-2 text-sm">{{message}}</p>
      <div class="flex flex-wrap my-8">

        <img v-for="image in images" :key="image.name" :src="'/api/v1/images/get/' + image.name"  :alt="image.name" class="object-contain h-48 w-full my-4 md:my-0 md:w-1/3">
      </div>
  </div>
</div>

</template>

<script>
import axios from "../middleware/axios";
// import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'UserImageModal',
    props: {
        show: {
            type: Boolean,
            required: true
        },
        userId: {
            type: Number,
            required: true
        }
    },
    data() {
      return {
        message: "",
        images: []
      }
    },
    mounted() {
      this.getImages()
    },
    methods: {

    closeModal() {
      this.$emit('close')
      // this.clearUserProfilId()
    },
    getImages() {
        axios.get(`images/user/${this.userId}`)
          .then((res) => {
            if (res.data.success) {
              if (res.data.images.length)
                this.images = res.data.images
              else
                this.message = "Aucune image"
            }
          })
          .catch(e => console.log(e))
      }
    },
    computed: {

    },
 
}
</script>

<style lang="css" scoped>
.modal {
  transition: opacity 0.25s ease;
}
</style>