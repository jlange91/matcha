<template>
  <transition name="fade">
    <div
      v-if="getVisibility"
      :class="getSuccess ? 'bg-teal-100 border-teal-600 text-teal-700' : 'bg-red-100 border-red-600 text-red-700'"
      class="border px-4 py-3 relative"
      role="alert"
    >
      <strong class="font-bold">{{ getSuccess ? 'Success' : 'Error' }}!</strong>
      <span class="block sm:inline">{{ getMessage }}</span>
      <span @click="toggle" class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          :class="getSuccess ? 'text-teal-500' : 'text-red-500'"
          class="fill-current h-6 w-6"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          ></path>
        </svg>
      </span>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  methods: {
    ...mapActions({
      setVisibility: "messages/setVisibility",
      clearMessage: "messages/clearMessage"
    }),
    toggle() {
        this.clearMessage()
        this.setVisibility(false)
    }
  },
  computed: {
    ...mapGetters({
      getVisibility: 'messages/getVisibility',
      getSuccess: 'messages/getSuccess',
      getMessage: 'messages/getMessage'
    })
  },
  watch: {
    getVisibility(val) {
      const self = this
      if (val) {
        setTimeout(() => {
          this.toggle()
        }, 7000)
      }
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
