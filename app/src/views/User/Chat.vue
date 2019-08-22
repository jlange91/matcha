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

        <li v-for="relation in relations" @click="select(relation.id)" :key="relation.id"
          class="flex flex-no-wrap items-center hover:bg-grey-300 text-black cursor-pointer p-3"
        >
          <div
            class="flex-shrink-0 w-12 h-12 bg-no-repeat bg-center bg-contain rounded-full mr-3"
            v-bind:style="{ backgroundImage: 'url(/api/v1/images/get/' + relation.avatar + ')' }"
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
       class="w-full lg:w-2/3"
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

      <div v-if="focus_id" class="w-full">
        <div>

          <div class="flex flex-col p-4">

            <div v-for="message in messages" :key="message.id" "backgroundColor(message.from_id)" class="rounded-lg text-sm p-3 mb-1">
              <p class="float-right">{{ message.body }}</p>
            </div>

          </div>

        </div>



        <div v-if="seen" class="flex flex-row-reverse">
          <span class="py-1 px-2 shadow-md no-underline rounded-full bg-blue-600 text-white font-sans font-semibold text-xs border-blue btn-primary">
            Vu.
          </span>
        </div>


        <div class="bg-white flex flex-wrap self-end items-center w-full text-xl my-4">
          <div class="p-2">
            <a href="#" class="text-grey-600 hover:text-grey-900">
              <i class="fas fa-paperclip"></i>
            </a>
          </div>
          <input
            v-model="form.message"
            type="text"
            class="flex-auto appearance-none focus:outline-none text-base p-2 border border-grey-100 rounded"
            placeholder="Write a message..."
          />

          <div class="p-2">
            <button @click="sendMessage()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from "vuex";

  import socket from '../../middleware/socket-instance';

  import axios from "../../middleware/axios";

  export default {
    data () {
      return {
        focus_id: 0,
        relations: {},
        messages: {},
        form: {
          message: ""
        },
        seen: false,
        limit: 10
      }
    },
    computed: {
      ...mapGetters({
        getUserId: "session/getUserId",
      }),
    },
    created() {
      socket.on("message", () => {
        this.updateMessages();
        this.updateRelations();
      });
      this.updateRelations();
    },
    destroyed() {
      socket.removeListener('message');
    },
    computed: {
      ...mapGetters({
        getUserId: 'session/getUserId'
      })
    },
    methods: {
      backgroundColor(from_id) {
        return this.getUserId == from_id ? 'bg-green-200 self-end' : 'bg-blue-200 self-start'
      },
      select(relation_id){
        this.focus_id = (this.focus_id == relation_id) ? '' : relation_id;
        this.updateMessages();
      },
      updateMessages(){
        axios
          .post("messages", {
            focus_id: this.focus_id,
            limit: this.limit
          })
          .then(res => {
            this.messages = (res.data.messages) ? res.data.messages.reverse() : "";
            this.seen = res.data.seen;
          })
          .catch(e => console.log("e ", e));
      },
      updateRelations(){
        axios
          .get("relations")
          .then(res => {
            res.data.relations.forEach((el) => {
              let now = new Date();
              let old = new Date(el.lastDateMessage);

              if (old == 'Invalid Date')
                return ;
              el.lastDateMessage = ((old.getFullYear() < now.getFullYear()) ||
              (old.getMonth() < now.getMonth()) ||
              (old.getDate() < now.getDate())) ? el.lastDateMessage.split(' ')[0] : el.lastDateMessage.split(' ')[1];
            });
            this.relations = res.data.relations;
          })
          .catch(e => console.log("e ", e));
      },
      sendMessage(){
        axios
          .post("messages/create", {
            to: this.focus_id,
            message: this.form.message
          })
          .then(res => {
            if (res.data.success == true)
              socket.emit('message', this.getUserId, this.focus_id);
              this.form.message = "";
              setTimeout(() => {
                  this.updateMessages();
                  this.updateRelations();
                }, 1000)
          })
          .catch(e => console.log("e ", e));
      }
    },
  }
</script>
