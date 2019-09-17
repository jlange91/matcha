<template>
  <div class="mt-8 p-4 container mx-auto min-w-sm max-w-lg rounded bg-white shadow">
          <div>
            <img v-if="getUserData.user_info.avatar != null" :src="'/api/v1/images/get/' + getUserData.user_info.avatar" :alt="getUserData.user_info.username" class="rounded-full w-32 h-32">
            <img v-else src="/api/v1/images/get/default.png" class="rounded-full w-32 h-32">
          </div>
          <div>
            Username: {{getUserData.user_info.username}}
            <br>
            Email: {{getUserData.user_info.email}}
            <br>
            First name: {{getUserData.user_info.first_name}}
            <br>
            Last name: {{getUserData.user_info.last_name}}
          </div>

          <div class="mt-8 flex flex-wrap" v-show="getUserData.user_info.completed">
            Age: {{getUserData.user_info.age}}
            <br>
            Gender: {{getUserData.user_info.gender}}
            <br>
            Sexual preference: {{getUserData.user_info.sexual_orientation}}
            <br>
            <p class="inline-flex w-full">Biography: 
              <span v-html="getUserData.user_info.biography"></span></p>
          </div>
           <div class="mt-8 flex flex-wrap">
            <span
              v-for="tag in getUserData.tags"
              :key="tag.id"
              class="m-2 bg-teal-100 rounded-full py-1 px-4 text-teal-700"
            >#{{tag.name}}</span>
          </div>
          <div class="mt-8">
       
            <user-profil-map :lat="getUserData.user_info.lat" :lng="getUserData.user_info.lng"/>
          </div>
         
        
        </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      getUserData: 'user/getData'
    })
  },
}
</script>