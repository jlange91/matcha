<template>
  <div
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover.prevent
    @drop="onDrop"
    :class="isdragging ? 'bg-gray-200' : 'bg-white'"
    class="flex flex-col uppercase items-center justify-center border-dashed rounded border-4 border-teal-600 bg-white p-4 container mx-auto w-5/6"
  >
    <div v-show="!images.length" class="flex flex-col justify-center items-center">
      <p>Drag your images here</p>
      <p>or</p>
      <div class="flex items-center justify-center w-full my-2 h-12">
        <label
          for="file"
          class="curesor-pointer absolute max-w-lg text-center py-2 px-2 rounded bg-teal-600 text-white"
        >Select file</label>
        <input class="hidden" type="file" name="file" id="file" @change="onInputChange" />
      </div>
    </div>
    <div class="px-2">
      <div v-show="images.length" class="flex flex-row-reverse">
        <form enctype="multipart/form-data">
          <button
            @click.prevent="upload"
            class="bg-white border border-teal-600 text-teal-600 px-4 py-2 rounded"
          >Upload images</button>
        </form>

        <label
          for="file"
          class="text-center py-2 px-2 rounded bg-teal-600 text-white mx-4 max-w-md"
        >Select file</label>
      </div>

      <div class="flex flex-wrap -mx-2">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 my-2"
        >
          <img :src="image" :alt="index" />
        </div>
      </div>
      <div class="flex flex-wrap -mx-2 mt-8">
        <div
          v-for="(image, index) in user_images"
          :key="index"
          class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-2 my-2 text-center cursor-pointer"
        >

          <img
          @click="chooseProfilImage(image.name)"
          :src="'localhost' + '/' + image.name" :alt="index" />
          <!-- <img
          :src="'localhost' + '/' + image.name" :alt="index" /> -->
          <button
            @click="eraseImage(image.name)"
            class="bg-red-600 text-white px-4 rounded my-2"
          >Effacer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../middleware/axios";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    getImages: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isdragging: false,
      dragCount: 0,
      files: [],
      images: [],
      user_images: []
    };
  },
  mounted() {
    this.getUserImages();
  },
  methods: {
    ...mapActions({
      setVisibility: "messages/setVisibility",
      setMessage: "messages/setMessage",
      setSuccess: "messages/setSuccess"
    }),
    chooseProfilImage(imageName) {
      let self = this
      axios.post('/user/avatar', {
        image: imageName.substring(19)
      })
        .then(res => {
            if (res.data.success) {
              self.setMessage("Your profile picture is updated");
              self.setSuccess(true);
              self.setVisibility(true);
            } else {
              self.setMessage(res.data.message);
              self.setSuccess(false);
              self.setVisibility(true);
            }
        })
        .catch(e => console.log("e ", e));
    },
    eraseImage(imageName) {
      axios
        .post("/images/delete", { image: imageName })
        .then(res => {
          if (res.data.success) this.getUserImages();
        })
        .catch(e => console.log("e ", e));
    },
    getUserImages() {
      axios
        .post("/images/user")
        .then(res => {
          res.data.images.forEach(img => {
            img.name = "/api/v1/images/get/" + img.name;
          });
          this.user_images = res.data.images;
        })
        .catch(e => console.log("e ", e));
    },
    upload() {
      const formData = new FormData();

      this.files.forEach(file => {
        formData.append(formData, file, file.name);
      });

      axios
        .post("images/upload", formData)
        .then(res => {
          if (res.data.success) {
            this.getUserImages();
            this.images = [];
            this.files = [];
            this.setMessage("Votre image est upload");
            this.setSuccess(true);
            this.setVisibility(true);
          } else {
            this.setMessage(res.data.message);
            this.setSuccess(false);
            this.setVisibility(true);
          }
        })
        .catch(e => console.log("e ", e));
    },
    onDragEnter(e) {
      e.preventDefault();
      this.dragCount++;
      this.isdragging = true;
    },
    onDragLeave(e) {
      e.preventDefault();
      this.dragCount--;
      if (this.dragCount <= 0) this.isdragging = false;
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = false;

      const files = e.dataTransfer.files;

      Array.from(files).forEach(file => this.addImage(file));
    },
    onInputChange(e) {
      const files = e.target.files;

      Array.from(files).forEach(file => this.addImage(file));
    },
    addImage(file) {
      if (!file.type.match("image.*")) {
        // send meesage with error on
        console.log(`${file.name} is not an image`);
        return;
      }

      if (this.images.length == 5) {
        this.files.shift();
        this.images.shift();
      }

      this.files.push(file);

      const reader = new FileReader();

      reader.onload = e => this.images.push(e.target.result);

      reader.readAsDataURL(file);
    }
  }
};
</script>

<style>
</style>
