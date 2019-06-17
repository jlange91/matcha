<template>
  <form
    class="my-4 container bg-white mx-auto w-full max-w-xs px-3 py-4 shadow rounded border-t-4 border-teal-500"
  >

    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6">
        <p class="text-gray-900 text-sm py-2">What's your gender ?</p>
        <v-select v-model="form.gender" :options="gender"></v-select>
      </div>
      <div class="w-full px-3 mb-6">
        <p class="text-gray-900 text-sm py-2">What's your birthdate ?</p>
        <input
          v-model="form.birthdate"
          min="1900-01-01"
          :max="today"
          type="date"
          name="birthdate"
          class="container mx-auto appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
          required
        >
      </div>
      <div class="w-full px-3 mb-6">
        <p class="text-gray-900 text-sm py-2">What's your sexual preference ?</p>
        <v-select v-model="form.sex_pref" :options="sex_pref"></v-select>
      </div>
      <div class="w-full px-3 mb-6">
        <p class="text-gray-900 text-sm py-2">Say something about yourself</p>
        <textarea
          name="bio"
          v-model.trim="form.bio"
          cols="30"
          rows="10"
          class="container mx-auto appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
          required
        ></textarea>
      </div>
      <div class="w-full px-3 mb-6">
        <p class="text-gray-900 text-sm py-2">Select or create some tags</p>
        <v-select
        v-model="form.tags"
          @input="updateTags"
          :close-on-select="true"
          :push-tags="true"
          :taggable="true"
          :multiple="true"
          :options="tags"
        ></v-select>
      </div>
    </div>
    <div class="flex justify-between w-full items-center">
      <button
        type="submit"
        @click.prevent="processFormInput"
        class="focus:outline-none bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
      >Save</button>
    </div>
    <!-- <div class="w-full px-3">
        <div>
          <app-input
            @focus="error.password = false"
            :error="error.password"
            v-model="user.password"
            :error-message="error_message.password"
            :type="password_type"
            name="current-password"
          >Password</app-input>
          <span
            v-show="user.password !== ''"
            @click.prevent="changePasswordInputType"
            class="focus:outline-none text-xs italic my-2 text-gray-500 cursor-pointer"
          >{{ passwordText }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-between w-full items-center">
         <button
        type="submit"
        @click.prevent="processFormInput"
        class="focus:outline-none bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
      >Login</button>
      <router-link to="/password-forgot" class="whitespace-no-wrap text-xs text-teal-500 hover:font-bold">
        Forgot your password ?
      </router-link>
    </div>-->
  </form>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import axios from "../../middleware/axios";

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    profil: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      tags: this.db_tags,
      gender: ["female", "men"],
      sex_pref: ["bisexual", "female", "men"],
      form: {
        birthdate: null,
        gender: null,
        sex_pref: "bisexual",
        bio: null,
        tags: []
      },
      errors: {
        birthdate: false,
        gender: false,
        bio: false,
        sex_pref: false,
        tags: false
      }
    };
  },
  methods: {
    ...mapActions({
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess"
    }),
    updateTags(val) {
      this.form.tags = val;
    },
    processFormInput() {
      if (this.form.birthdate === null || this.form.birthdate === "") {
        this.errors.birthdate = true;
      }
      if (!this.form.sex_pref === "female" || !this.form.sex_pref === "men" || !this.form.sex_pref === "male") {
        this.errors.gender = true;
      }
      if (this.form.bio === null || this.form.bio === "") {
        this.errors.bio = true;
      }
      if (!this.form.tags.length) {
        this.errors.tags = true;
      }
      if (
        !this.form.sex_pref === "bisexual" ||
        !this.form.sex_pref === "female" ||
        !this.form.sex_pref === "men" 
      ) {
        this.errors.sex_pref = true;
      }
      let empty = false;
      const self = this;
      Object.keys(this.errors).forEach((key) => {
        if (self.errors[key]) empty = true;
      });
      if (!empty) return this.submit();
      else {
        this.setMessage("Please fill in all the fields");
        this.setSuccess(false);
        this.setVisibility(true);
        Object.keys(this.errors).forEach((key) => {
          if (self.errors[key]) self.errors[key] = false;
        });
      }
    },
    async submit() {
      try {
        const result = await axios.post(`user/profil/edit`, this.form);
        if (result.data.success) {
          this.setMessage("Good job next step upload some images");
          this.setSuccess(true);
          this.setVisibility(true);
        } else {
          this.setMessage(result.data.message);
          this.setSuccess(false);
          this.setVisibility(true);
        }
      } catch (error) {
        this.setMessage(error);
        this.setSuccess(false);
        this.setVisibility(true);
      }
    },

  },
  computed: {
    ...mapGetters({
      getProfil: "profil/getUserProfil",
            getTags: "tags/getTags"

    }),
    today() {
      return moment(new Date()).format("Y-MM-DD");
    }
  },
  async created() {
    try {
      const { data } = await axios.get("/tags");
      this.tags = data.map(tag => tag.name);

      this.form.bio = this.getProfil.biography
      this.form.sex_pref = this.getProfil.sexual_orientation
      this.form.gender = this.getProfil.gender
      if (this.getProfil.birthdate) {
    const bDay = this.getProfil.birthdate.split('T')
      this.form.birthdate = bDay[0]
      }
  
      this.form.tags = this.getTags.map((tag) => tag.name)
      
    } catch (error) {
      this.setMessage(error);
      this.setSuccess(false);
      this.setVisibility(true);
    }
  },
};
</script>

<style>
</style>
