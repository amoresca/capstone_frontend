<template>
  <div class="requests-channel mt-100">
    <div
      v-for="notification in orderBy(notifications, 'created_at', -1)"
      :key="notification.created_at"
    >
      <div v-if="!notification.read"
        >{{ notification.requestor.first_name }} {{ notification.requestor.last_name }}
        <span v-if="notification.item && notification.item.available"
          >wants to borrow {{ notification.item.name }}.</span
        ><span v-else-if="notification.item && !notification.item.available"
          >has been added to the waitlist for {{ notification.item.name }}.</span
        ><span v-else>sent you a friend request.</span>&nbsp;
        <small>{{ relativeDate(notification.created_at) }}</small>
        <div v-if="notification.item && notification.item.available">
          <button
            class="btn btn-info btn-xs"
            v-on:click="acceptBorrowRequest(notification)"
            >Accept Borrow Request</button
          >
          <button class="btn btn-secondary btn-xs">Reject Borrow Request</button>
        </div>
        <div v-else-if="!notification.item">
          <button class="btn btn-info btn-xs">Accept Friend Request</button>
          <button class="btn btn-secondary btn-xs">Reject Friend Request</button>
        </div>
        <hr />
      </div>
    </div>
    <router-link to="/requests">View all requests</router-link>
  </div>
</template>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";
import ActionCable from "actioncable";
import moment from "moment";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      notifications: []
    };
  },
  created: function() {
    axios.get("/api/borrow-requests").then(response => {
      this.notifications = response.data.borrow_requests.concat(
        response.data.friend_requests
      );
    });
    var cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    cable.subscriptions.create("RequestsChannel", {
      connected: () => {
        // Called when the subscription is ready for use on the server
        console.log("Connected to RequestsChannel");
      },
      disconnected: () => {
        // Called when the subscription has been terminated by the server
      },
      received: data => {
        // Called when there's incoming data on the websocket for this channel
        console.log("Data from RequestsChannel:", data);
        this.notifications.unshift(data); // update the messages in real time
      }
    });
  },
  methods: {
    relativeDate: function(date) {
      return moment(date).fromNow();
    },
    acceptBorrowRequest: function(request) {
      var params = {
        status: "accepted",
        read: true
      };
      axios
        .patch(`/api/borrow-requests/${request.id}`, params)
        .then(response => {
          console.log(response.data);
          var index = this.notifications.indexOf(request);
          this.notifications.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    }
  }
};
</script>
