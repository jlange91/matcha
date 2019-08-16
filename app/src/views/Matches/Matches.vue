<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">Matches</h1>
    <user-card
      v-for="user in all_users"
      @like="like"
      @unlike="unlike"
      :key="user.id"
      :user="user"
      :liked="likes"
    />
  </div>
</template>

<script>
import axios from "../../middleware/axios";
export default {
  data() {
    return {
      all_users: [],
      likes: []
    };
  },
  mounted() {
      this.getAllPossibleMatches()
  },
  methods: {
    getAllPossibleMatches() {
        axios.post('/matches')
            .then((res) => {
                if (res.data.success)
                {
                  this.likes = res.data.user_likes
                  this.all_users = res.data.possible_matches
                }
            })
            .catch(e => console.log(e))
    },
    like(user_id) {
      this.likes.push({ liked_id: user_id });
      this.removeUserFromArray(user_id)
    },
    unlike(user_id) {
      this.removeLikeFromArray(user_id);
    },
    removeLikeFromArray(value) {
      const ret = this.likes.filter(function(ele) {
        return ele.liked_id != value;
      });
      this.likes = ret;
    },
    removeUserFromArray(value) {
      const ret = this.all_users.filter(function(ele) {
        return ele.id != value;
      });
      this.all_users = ret;
    }
  },
  watch: {
    all_users() {
      this.likes.forEach(element => {
        this.all_users.forEach((user) => {
            if (!(element.like_id == user.id))
              this.removeUserFromArray(user.id)
          })
      })
    }
  }
};
</script>