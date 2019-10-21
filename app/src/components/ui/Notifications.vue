<template>
  <div @click="displayNotifications()" class="cursor-pointer">
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
        class="border-b-2 border-gray-100 bg-green-200"
      >
        <p @click="removeNotification(notification.id)" class="p-4">{{ notification.username1 + types[notification.type] }}</p>
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
      notifications: [],
      types: {
            like: " vous a likez.",
            unlike: " vous a unlikez.",
            view: " a vu votre profil.",
            message: " vous a envoyez un message.",
            match: " vous a matchez."
        },
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
        axios
          .get("notifications")
          .then(res => {
            this.notifications = res.data.notifications
          })
          .catch(e => console.log("e ", e))
    },
    displayNotifications() {
      if (this.notificationsCount > 0 || this.is_visible)
        this.is_visible = !this.is_visible
      if (this.is_visible === true) {
        axios
          .post("notifications/setSeen", {
            notifications: this.notifications
          })
          .catch(e => console.log("e ", e));
      }
    },
    removeNotification(id) {
      axios
        .post("notifications/remove", {
          notificationId: id
        })
        .then(this.notifications = this.notifications.filter((notif) => {
          return notif.id !== id
        }))
        .catch(e => console.log("e ", e));
    }
  },
  computed: {
    notificationsCount() {
      return (this.notifications) ? this.notifications.length : 0;
    }
  }
};
</script>
