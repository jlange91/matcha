<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg mx-auto my-8">
    <img
      v-if="user.avatar != null"
      :src="'/api/v1/images/get/' + user.avatar"
      :alt="user.username"
      class="rounded-full w-32 h-32 mx-auto"
    />
    <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32" />
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2 text-center">{{user.username}}</div>
    </div>
    <div class="px-6 py-4">
      <span
        v-for="tag in user_tags"
        :key="tag"
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
      >{{tag}}</span>
    </div>
    <button @click="likeUser(user.id)" class="focus:outline-none hover:bg-teal-700 bg-teal-600 text-white uppercase w-full py-2 font-semibold">
      Like
    </button>
  </div>
</template>

<script>
import axios from "../middleware/axios";
export default {
  name: "UserCard",
  props: {
    user: {
      type: Object,
      required: true
    },
    // liked: {
    //   type: Boolean,
    //   required: true
    // }
  },
  data() {
    return {
      user_tags: []
    };
  },
  methods: {
    likeUser(user_id) {
      axios.post('likes', {liked_id: user_id})
            .then((res) => {
              console.log(res)
            })
    }
  },
  mounted() {
    this.user_tags = this.user.user_tags.split(",");
  }
};
</script>