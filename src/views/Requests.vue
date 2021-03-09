<template>
  <div class="requests" v-if="requests">
    <div
      class="alert alert-warning alert-dismissible fade show"
      role="alert"
      v-if="alert"
    >
      <strong>{{ alert }}</strong>
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <h1>Requests</h1>
    <h2>Borrow Requests</h2>
    <div v-if="requests.borrow_requests.length > 0">
      <div v-for="request in requests.borrow_requests" :key="request.id">
        <img :src="request.requestor.image_url" alt="" width="50" />
        <h3>
          {{ request.requestor.first_name }} wants to borrow
          {{ request.item.name }}.
        </h3>
        <!-- <img :src="request.item.image_url" alt="" width="100" /> -->
        <button v-on:click="acceptBorrowRequest(request)">Accept</button>
        <button v-on:click="rejectBorrowRequest(request)">Reject</button>
      </div>
    </div>
    <div v-else>You have no pending borrow requests.</div>
    <hr />
    <h2>Friend Requests</h2>
    <div v-if="requests.friend_requests.length > 0">
      <div v-for="request in requests.friend_requests" :key="request.id">
        <img :src="request.requestor.image_url" alt="" width="50" />
        <h3>
          {{ request.requestor.first_name }} {{ request.requestor.last_name }}
        </h3>
        <button v-on:click="acceptFriendship(request)">Accept</button>
        <button v-on:click="rejectFriendship(request)">Reject</button>
      </div>
    </div>
    <div v-else>You have no pending friend requests.</div>
  </div>
</template>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      requests: "",
      alert: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/api/borrow-requests").then(response => {
      this.requests = response.data;
      console.log(response.data);
    });
  },
  methods: {
    acceptBorrowRequest: function(request) {
      axios
        .patch(`/api/borrow-requests/${request.id}`, { status: "accepted" })
        .then(response => {
          this.alert = response.data.message;
          var index = this.requests.borrow_requests.indexOf(request);
          this.requests.borrow_requests.splice(index, 1);
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
          this.alert = "Borrow request rejected.";
          var index = this.requests.borrow_requests.indexOf(request);
          this.requests.borrow_requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    acceptFriendship: function(request) {
      axios
        .patch(`/api/friendships/${request.id}`)
        .then(response => {
          this.alert = response.data.message;
          var index = this.requests.friend_requests.indexOf(request);
          this.requests.friend_requests.splice(index, 1);
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
          this.alert = "Friend request removed.";
          var index = this.requests.friend_requests.indexOf(request);
          this.requests.friend_requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    }
  }
};
</script>
