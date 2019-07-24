<template>
  <div class="flex flex-wrap">
    <div class="flex flex-wrap items-start content-start w-full lg:w-1/3 border-r border-grey-lighter h-full">
      <div class="flex flex-shrink justify-between self-start items-center w-full px-2 py-4">
        <div class="text-center px-2 mr-2">
          <a href="#" class="text-lg text-grey hover:text-grey-dark">
            <i class="fas fa-bars"></i>
          </a>
        </div>
        <input
          type="text"
          class="flex-auto appearance-none bg-grey-300 text-sm rounded px-4 py-2 border border-grey-100 focus:outline-none"
          placeholder="Search"
        />
      </div>

      <ul class="flex flex-col w-full select-none">


        <li v-for="relation in relations"
          class="flex flex-no-wrap items-center hover:bg-grey-300 text-black cursor-pointer p-3"
        >
          <div
            class="flex-shrink-0 w-12 h-12 bg-no-repeat bg-center bg-contain rounded-full mr-3"
            v-bind:style="{ backgroundImage: 'url(' + relation.avatar + ')' }"
          ></div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between mb-1">
              <h2 class="font-semibold text-sm">{{ relation.username }}</h2>
              <span class="text-sm text-grey-dark">
                <i class="fas fa-check text-green"></i>
                <i class="fas fa-check text-green -ml-3"></i>
                 {{ relation.lastDateMessage }}
              </span>
            </div>
            <div class="text-sm text-grey-dark truncate">
              <span> {{ relation.lastMessage }} </span>
            </div>
          </div>
        </li>


      </ul>
    </div>
    <div
      class="content-start flex flex-col flex-wrap items-start w-full lg:w-2/3"
    >
      <div class="flex justify-between items-center w-full border-b border-grey-lighter">
        <div class="flex-auto cursor-pointer select-none py-2 px-6">
          <h2 class="font-semibold text-base -mb-1">Matcha chat</h2>
          <span class="text-grey-900 text-sm">3 matches</span>
        </div>
        <ul class="flex py-2 px-4">
          <li class="px-4">
            <a href="#" class="text-grey-600 hover:text-grey-900">
              <i class="fas fa-search"></i>
            </a>
          </li>
          <li class="px-4">
            <a href="#" class="text-grey-600 hover:text-grey-900">
              <i class="fas fa-ellipsis-v"></i>
            </a>
          </li>
        </ul>
      </div>
      <div
        class="flex flex-auto bg-no-repeat bg-center bg-cover overflow-y-auto bg-grey-300">
        <div class="p-4">
          <div class="bg-green-100 rounded-lg text-sm p-3 mb-1">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam in, aliquid cum ut similique, reiciendis provident hic mollitia totam facere aspernatur numquam consequatur sunt. Facere aliquam sapiente fugit eveniet totam!</p>
          </div>
          <div class="bg-green-100 rounded-lg text-sm p-3 mb-3">
            <p>Markdown lib ?</p>
          </div>

          <div class="bg-blue-100 rounded-lg text-sm p-3 mb-1">
            <a
              href="https://www.youtube.com"
              class="hover:underline text-blue-600"
              target="_blank"
            >https://www.youtube.com</a>
            <div class="flex items-center mt-2">
              <blockquote class="border-l-2 border-blue pl-2">
                <p class="font-medium text-blue-500">Youtube</p>
                <p>Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.</p>
              </blockquote>
              <a href="https://www.youtube.com" target="_blank" class="flex-auto">
                <img src="https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png" alt />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white flex flex-wrap self-end items-center w-full text-xl my-4">
        <div class="p-2">
          <a href="#" class="text-grey-600 hover:text-grey-900">
            <i class="fas fa-paperclip"></i>
          </a>
        </div>
        <input
          type="text"
          class="flex-auto appearance-none focus:outline-none text-base p-2 border border-grey-100 rounded"
          placeholder="Write a message..."
        />

        <div class="p-2">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
            SEND
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from "vuex";

  import axios from "../../middleware/axios";

  export default {
    data () {
      return {
        relations: {}
      }
    },
    mounted() {
      axios
        .get("relations")
        .then(res => {
          this.relations = res.data.relations;
        })
        .catch(e => console.log("e ", e));
    },
    methods: {
    },
    computed: {
    },
  };
</script>
