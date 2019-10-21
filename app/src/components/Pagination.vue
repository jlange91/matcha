<template>
  <div>
  <div class="flex justify-center -mx-4">
  <div v-if="pageNumber > 0" @click="prevPage" class="px-4 focus:ouline-none cursor-pointer">
    Previous
  </div>
  <div v-if="pageNumber < pageCount - 1" @click="nextPage" class="focus:ouline-none cursor-pointer">
    Next
  </div>

  </div>
  <div class="flex flex-wrap content-center">
     <user-card
      class="px-2 w-full"
       @like="like"
      @unlike="unlike"
      v-for="user in paginatedData"
      :key="user.id"
      :user="user"
      :liked="likes"
    />
  </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
    props: {
    listData: {
      type: Array,
      required: true
    },
    size: {
      type: Number,
      required: false,
      default: 5
    },
    userLikes: {
      type: Array,
      required: false,
      default: null
    }
  },
  mounted() {
    this.likes = this.userLikes
  },
  data() {
    return {
      pageNumber: 0,
        likes: []
    }
  },
  methods: {
    nextPage() {
      if (this.pageNumber < this.pageCount - 1)
        this.pageNumber++
    },
    prevPage() {
      if (this.pageNumber > 0)
        this.pageNumber--
    },
    like(user_id) {
      this.likes.push({ liked_id: user_id });
      this.$emit('refreshMatchs')
    },
    unlike(user_id) {
      this.arrayRemove(user_id);
    },
    arrayRemove(value) {
      const ret = this.likes.filter(function(ele) {
        return ele.liked_id != value;
      });
      this.likes = ret
    },
  },
  computed: {
    pageCount() {
      let l = this.listData.length
      let s = this.size
      return Math.ceil(l/s)
    },
    paginatedData() {
      const start = this.pageNumber * this.size,
            end = start + this.size
       return this.listData.slice(start, end)
    }
  },
  watch: {
    userLikes(newVal) {
      this.likes = this.userLikes
    }
  },
}
</script>
