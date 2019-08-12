<template>
  <div class="mt-8 p-4 container mx-auto rounded bg-white shadow">
    <h1 class="text-xl uppercase font-bold mb-8">All Users</h1>
    <user-card v-for="user in all_users" :key="user.id" :user="user"/>
  </div>
</template>

<script>
import axios from "../../middleware/axios";
export default {
    mounted() {
        this.getAllUsers()
    },
    data() {
        return {
            all_users: [],
            likes: []
        }
    },
    methods: {
        getAllUsers() {
            axios.post('/users')
                .then((res) => {
                    // console.log(res.data)
                    this.all_users = res.data.users
                    this.all_users = res.data.likes
                })
        },
        isLiked(user_id) {
            console.log(user_id)
            // this.likes.forEach(element => {
            //     if (user_id === element.liked_id)
            //         return true
            //     else 
            //         return false 
            // });


        }
    }
};
</script>