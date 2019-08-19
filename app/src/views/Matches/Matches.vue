<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">Possible Matches</h1>
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
            this.isMatch()
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
      this.users = ret;
    },
    isMatch() {
  
        const current_user_gender = this.getProfil.gender;
        const current_user_sexual_orientation = this.getProfil.sexual_orientation;
        
        let filtered_users = []

        console.log('1 : ', current_user_gender === 'male' && current_user_sexual_orientation === 'female')
        if (current_user_gender === 'male' && current_user_sexual_orientation === 'female')  {
           filtered_users.push(el)
        }
        console.log('2 : ', current_user_gender === 'female' && current_user_sexual_orientation === 'male')
        if (current_user_gender === 'female' && current_user_sexual_orientation === 'male')  {
           filtered_users.push(el)
        }
        console.log('3 : ', current_user_gender === 'male' && current_user_sexual_orientation === 'male')
        if (current_user_gender === 'male' && current_user_sexual_orientation === 'male')  {
           filtered_users.push(el)
        }
        console.log('4 : ', current_user_gender === 'female' && current_user_sexual_orientation === 'female')
        if (current_user_gender === 'female' && current_user_sexual_orientation === 'female')  {
           filtered_users.push(el)
            this.users.forEach((el) => {
                console.log('4.1 : ' + el.gender === 'female' && (el.sexual_orientation === 'female' || el.sexual_orientation === 'bisexual'))
                if(el.gender === 'female' && (el.sexual_orientation === 'female' || el.sexual_orientation === 'bisexual'))
                    filtered_users.push(el)
            })
        }
        console.log('5 : ', current_user_gender === 'female' && current_user_sexual_orientation === 'bisexual')
        if (current_user_gender === 'female' && current_user_sexual_orientation === 'bisexual')  {
            this.users.forEach((el) => {
              console.log(el.gender === 'female' && (el.sexual_orientation === 'female' || el.sexual_orientation === 'bisexual')
                   || el.gender === 'male' && (el.sexual_orientation === 'female' || el.sexual_orientation === 'bisexual'))
                if(el.gender === 'female' && (el.sexual_orientation === 'female' || el.sexual_orientation === 'bisexual')
                   || el.gender === 'male' && (el.sexual_orientation === 'female' || el.sexual_orientation === 'bisexual'))
                    filtered_users.push(el)
            })
        }
        console.log('6 : ', current_user_gender === 'male' && current_user_sexual_orientation === 'bisexual')
        if (current_user_gender === 'male' && current_user_sexual_orientation === 'bisexual')  {
           filtered_users.push(el)
        }  
        // console.log('filtered users')
        // console.log(filtered_users)    
        this.filtered_users = filtered_users
        // this.is_liked()
      // return user
    },
    // is_liked() {
     
    // }
  },
  computed: {
    ...mapGetters({
      getToken: "session/getToken",
      getUser: "session/getUser",
      getProfil: "profil/getUserProfil",
      getLocation: "profil/getUserLocation",
      getTags: "tags/getTags"
    }),
    all_users() {
      if (this.likes.length) {
        this.likes.forEach(element => {
          this.filtered_users.forEach(user => {
            // this.isMatch(user)
            if (!(element.like_id == user.user_id)) this.removeUserFromArray(user.user_id);
          });
        });
      }
      return this.filtered_users
    }
  }
};
</script>