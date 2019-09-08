<template>
   <div  v-if="show" :name="modalName" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
  <div @click="closeModal" class="modal-overlay absolute w-full h-full bg-black opacity-25 top-0 left-0 cursor-pointer"></div>
  <div class="absolute w-1/2 h-32 bg-white rounded-sm shadow-lg flex items-center justify-center text-2xl">
    {{user.username }} 🚀
  </div>
</div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'UserProfilModal',
    props: {
        user: {
            type: Object,
            required: true
        },
        modalName: {
            type: String,
            required: true
        }
    },
    data() {
      return {
        show: false
      }
    },
    methods: {
       ...mapActions({
      clearUserProfilId: "viewing/clearUserProfilId"
    }),
    closeModal() {
      this.show = false
      this.clearUserProfilId()
    }
    },
    computed: {
      ...mapGetters({
        getUserProfilId: "viewing/getUserProfilId"
      }),
    },
    watch: {
      getUserProfilId(val) {
        if (val) {
          if (val === this.user.id) {
            this.show = true
          }
          else {
            this.show = false
          }
        }
      }
    }
}
</script>

<style lang="css" scoped>
.modal {
  transition: opacity 0.25s ease;
}
</style>