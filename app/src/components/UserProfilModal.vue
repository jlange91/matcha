<template>
   <div :name="modalName" class="modal pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
  <div class="modal-overlay absolute w-full h-full bg-black opacity-25 top-0 left-0 cursor-pointer"></div>
  <div class="absolute w-1/2 h-32 bg-white rounded-sm shadow-lg flex items-center justify-center text-2xl">
    🚀
  </div>
</div>

</template>

<script>
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
}
</script>

<style lang="css" scoped>
.modal {
  transition: opacity 0.25s ease;
}
</style>