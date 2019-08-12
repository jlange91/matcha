<template>
  <div @click="is_visible = !is_visible" class="cursor-pointer">
    <div class="text-white px-1 ml-1 flex inline-flex py-1 items-center">
      <svg
        class="mx-2 h-5 w-5 fill-current text-gray-600 cursor-pointer"
        viewBox="0 0 20 20"
      >
        <path
          d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z"
          fill-rule="evenodd"
        />
      </svg>
      <span class="text-gray-600 -ml-2">
      {{notificationsCount}}
      </span>

    </div>
    <div v-if="is_visible" class="absolute bg-white shadow-lg overflow-y-scroll h-48 rounded">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="backGroundStyle(notification.type)"
      >
        <p class="p-4">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>

import socket from '../../middleware/socket-instance';
import axios from "../../middleware/axios";

export default {
  data() {
    return {
      is_visible: false,
      notifications: []
    };
  },
  created() {
    socket.on("notif", () => {
      this.updateNotifications();
    });
    this.updateNotifications();
  },
  destroyed() {
    socket.removeListener('notif');
  },
  methods: {
    updateNotifications() {
      console.log("updateNotif");
        axios
          .get("notifications")
          .then(res => {
            console.log("ici" + res.data);
          })
          .catch(e => console.log("e ", e));
    },
    backGroundStyle(type) {
      if (type === "message") return "bg-green-300";
      if (type === "match") return "bg-red-300";
      if (type === "like") return "bg-teal-300";
      if (type === "view") return "bg-blue-300";
    }
  },
  computed: {
    notificationsCount() {
      return this.notifications.length;
    }
  }
};
</script>
