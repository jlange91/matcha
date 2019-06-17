<template>
    <div>
    <vue-dropzone 
    @vdropzone-complete="afterComplete"
     @vdropzone-error="removeFile"
    ref="myVueDropzone" 
    id="dropzone" 
    :options="dropzoneOptions"></vue-dropzone>
</div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { mapGetters } from 'vuex';

export default {
  name: 'DropZone',
  components: {
    vueDropzone: vue2Dropzone
  },
  props: {
    token: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dropzoneOptions: {
          url: 'http://localhost:5000/api/v1/images/create',
          thumbnailWidth: 150,
          thumbnailHeight: 150,
          maxFilesize: 2,
          maxFiles: 5,
          acceptedFiles: "image/*",
          addRemoveLinks: false,
          headers: { "authorization": 'Bearer ' + this.token }
      }
    }
  },
    methods: {
    afterComplete(file) {
      console.log(file);
    },
    removeFile(file) {
      this.$refs.myVueDropzone.removeFile(file)
    }
  }
}
</script>

<style>

</style>
