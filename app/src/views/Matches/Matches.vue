<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">Possible Matches</h1>
    <user-card
      v-for="user in filtered_users"
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      users: [],
      likes: [],
      filtered_users: []
    };
  },
  async mounted() {
    await this.getAllPossibleMatches();
    // this.isMatch()
  },
  methods: {
    async getAllPossibleMatches() {
      await axios
        .post("/matches")
        .then(res => {
          if (res.data.success) {
            // console.log('matches ' + res.data.possible_matches)
            this.likes = res.data.user_likes;
            this.users = res.data.possible_matches;
            this.check_users()
            // this.isMatch()
            // this.isMatch(res.data.possible_matches)
            // const test = this.isMatch(res.data.possible_matches);
            // console.log(test)
          }
        })
        .catch(e => console.log(e));
    },
    like(user_id) {
      this.likes.push({ liked_id: user_id });
      this.removeUserFromArray(user_id);
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
      const ret = this.filtered_users.filter(function(ele) {
        return ele.id != value;
      });
      this.filtered_users = ret;
    },
  
    check_users() {


      const current_user_gender = this.getProfil.gender;
      const current_user_sexual_orientation = this.getProfil.sexual_orientation;

      let filtered_users = [];

      if (
        current_user_gender === "male" &&
        current_user_sexual_orientation === "female"
      ) {
        this.users.forEach(user => {
          if (
            (user.gender === "female" &&
              (user.sexual_orientation === "female" ||
                user.sexual_orientation === "bisexual"))
          );
          filtered_users.push(user);
        });
      }

      if (
        current_user_gender === "female" &&
        current_user_sexual_orientation === "male"
      ) {
        this.users.forEach(user => {
          if (
            (user.gender === "male" &&
              (user.sexual_orientation === "female" ||
                user.sexual_orientation === "bisexual"))
          );
          filtered_users.push(user);
        });
      }

      if (
        current_user_gender === "male" &&
        current_user_sexual_orientation === "male"
      ) {
            this.users.forEach(user => {
          if (
            (user.gender === "male" &&
              (user.sexual_orientation === "male" ||
                user.sexual_orientation === "bisexual"))
          );
          filtered_users.push(user);
        });
      }

      if (
        current_user_gender === "female" &&
        current_user_sexual_orientation === "female"
      ) {
        //  filtered_users.push(el)
        this.users.forEach((el) => {
        if (
          el.gender === "female" &&
          (el.sexual_orientation === "female" ||
            el.sexual_orientation === "bisexual")
        )
          filtered_users.push(el);
        })
      }

      if (
        current_user_gender === "female" &&
        current_user_sexual_orientation === "bisexual"
      ) {
        this.users.forEach(user => {
          // console.log(user)
          if (
            (user.gender === "female" &&
              (user.sexual_orientation === "female" ||
                user.sexual_orientation === "bisexual")) ||
            (user.gender === "male" &&
              (user.sexual_orientation === "female" ||
                user.sexual_orientation === "bisexual"))
          );
          filtered_users.push(user);
        });

      }

      if (
        current_user_gender === "male" &&
        current_user_sexual_orientation === "bisexual"
      ) {
            this.users.forEach(user => {
          if (
            (user.gender === "female" &&
              (user.sexual_orientation === "male" ||
                user.sexual_orientation === "bisexual") || (user.gender === "male" &&
              (user.sexual_orientation === "male" ||
                user.sexual_orientation === "bisexual"))
          ))
          filtered_users.push(user);
        });
      }

      // console.log(filtered_users)
      this.filtered_users = filtered_users;
    }
  
  },
  computed: {
    ...mapGetters({
      getToken: "session/getToken",
      getUser: "session/getUser",
      getProfil: "profil/getUserProfil",
      getLocation: "profil/getUserLocation",
      getTags: "tags/getTags"
    }),
    // filtered() {
    //   console.log('filtered')

    //   if (this.likes.length) {
    //     const self = this;
    //     this.likes.forEach(element => {
    //       this.filtered_users.forEach(user => {
    //         console.log(this.filtered_users)
    //         if (!(element.like_id == user.user_id))
    //           return self.removeUserFromArray(user.user_id);
    //         // this.isMatch(user)
    //       });
    //     });
    //     console.log(this.filtered_users)
    //     return this.filtered_users
    //   }
    // }
  },
  watch: {
    
  }
};
</script>