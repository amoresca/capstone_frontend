<template>
  <div class="requests-channel mt-100">
    <div v-for="request in orderBy(requests, 'created_at', -1)" :key="request.created_at">
      <!-------- Borrow Request for available item -------->
      <div v-if="request.item && request.item.available">
        <p
          >{{ request.requestor.first_name }} {{ request.requestor.last_name }} wants to
          borrow {{ request.item.name }}.&nbsp;<small>{{
            relativeDate(request.created_at)
          }}</small></p
        >
        <button class="btn btn-info btn-xs" v-on:click="acceptBorrowRequest(request)"
          >Accept Borrow Request</button
        >
        <button class="btn btn-secondary btn-xs" v-on:click="rejectBorrowRequest(request)"
          >Reject Borrow Request</button
        >
        <button
          class="btn btn-xs btn-icon btn-circle btn-secondary ml-10"
          v-on:click="markAsRead(request)"
          ><i class="fas fa-times"></i
        ></button>
        <hr />
      </div>
      <!-------- Waitlist (Borrow Request for unavailable item) -------->
      <div v-else-if="request.item && !request.item.available">
        <p
          >{{ request.requestor.first_name }} {{ request.requestor.last_name }} has been
          added to the waitlist for {{ request.item.name }}.&nbsp;<small>{{
            relativeDate(request.created_at)
          }}</small></p
        >
        <hr />
      </div>
      <!-------- Friend Request -------->
      <div v-else>
        <p
          >{{ request.requestor.first_name }} {{ request.requestor.last_name }} sent you a
          friend request.&nbsp;<small>{{ relativeDate(request.created_at) }}</small></p
        >
        <button class="btn btn-info btn-xs" v-on:click="acceptFriendship(request)"
          >Accept Friend Request</button
        >
        <button class="btn btn-secondary btn-xs" v-on:click="rejectFriendship(request)"
          >Reject Friend Request</button
        >
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
      requests: []
    };
  },
  created: function() {
    axios.get("/api/borrow-requests").then(response => {
      this.requests = response.data.borrow_requests.concat(response.data.friend_requests);
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
        this.requests.unshift(data); // update the messages in real time
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
          var index = this.requests.indexOf(request);
          this.requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    rejectBorrowRequest: function(request) {
      axios
        .delete(`/api/borrow-requests/${request.id}`)
        .then(response => {
          console.log(response.data);
          var index = this.requests.indexOf(request);
          this.requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    acceptFriendship: function(request) {
      var params = {
        status: "accepted",
        read: true
      };
      axios
        .patch(`/api/friendships/${request.id}`, params)
        .then(response => {
          console.log(response.data);
          var index = this.requests.indexOf(request);
          this.requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    rejectFriendship: function(request) {
      axios
        .delete(`/api/friendships/${request.id}`)
        .then(response => {
          console.log(response.data);
          var index = this.requests.indexOf(request);
          this.requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    markAsRead: function(request) {
      if (request.item) {
        axios
          .patch(`/api/borrow-requests/${request.id}`, { read: true })
          .then(response => {
            console.log(response.data);
            var index = this.requests.indexOf(request);
            this.requests.splice(index, 1);
          });
      } else {
        axios.patch(`/api/friendships/${request.id}`, { read: true }).then(response => {
          console.log(response.data);
          var index = this.requests.indexOf(request);
          this.requests.splice(index, 1);
        });
      }
    }
  }
};
</script>
