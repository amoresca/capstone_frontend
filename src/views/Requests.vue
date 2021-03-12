<template>
  <div class="requests" v-if="requests">
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <h1>Requests</h1>
        <h5 class="mb-30">Incoming!</h5>
      </div>
      <img
        src="/assets/images/angle-light.svg"
        class="img-bottom mt-100"
        alt=""
      />
    </header>
    <div class="main-container">
      <section class="lg">
        <div class="container">
          <div
            class="alert alert-warning alert-dismissible fade show"
            role="alert"
            v-if="alert"
          >
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true" class="fas fa-times fs-16"></span>
            </button>
            <span class="fas fa-exclamation-circle fs-22 mr-15"></span>
            <strong>{{ alert }}</strong>
          </div>
          <div class="row">
            <div class="col-lg-6 pr-lg-5">
              <h2 class="mb-50"
                ><i class="fas fa-people-arrows fs-34 mr-5"></i> Borrow
                Requests</h2
              >
              <div v-if="requests.borrow_requests.length > 0">
                <div
                  class="promo-box promo-left"
                  v-for="request in filterBy(
                    requests.borrow_requests,
                    true,
                    'item.available'
                  )"
                  :key="request.id"
                >
                  <div class="promo-container-big">
                    <div class="promo-big">
                      <router-link :to="`/users/${request.requestor.username}`"
                        ><img
                          :src="request.requestor.image_url"
                          alt=""
                          class="promo-box-image mb-25 raised-sm circle"
                      /></router-link> </div
                    ><!-- / promo-big -->
                    <h5 class="box-title mb-15"
                      >{{ request.requestor.first_name }}
                      {{ request.requestor.last_name }}
                      wants to borrow:
                    </h5>
                    <h6 class="box-description mb-15">{{
                      request.item.name
                    }}</h6>
                    <img
                      :src="request.item.image_url"
                      alt=""
                      class="rounded-10 raised-sm mb-15"
                    />
                    <button
                      v-on:click="acceptBorrowRequest(request)"
                      class="btn btn-outline-primary pill mr-25"
                      >Accept</button
                    >
                    <button
                      v-on:click="rejectBorrowRequest(request)"
                      class="btn btn-danger pill"
                      >Reject</button
                    ></div
                  ><!-- / promo-container -->
                </div>
                <h3 class="mt-50"
                  ><i class="fas fa-clipboard-list mr-5"></i> Waitlist</h3
                >
                <div
                  class="promo-box promo-left"
                  v-for="request in orderBy(
                    filterBy(requests.borrow_requests, false, 'item.available'),
                    'created_at'
                  )"
                  :key="request.id"
                >
                  <div class="promo-container-big">
                    <div class="promo-big">
                      <router-link :to="`/users/${request.requestor.username}`"
                        ><img
                          :src="request.requestor.image_url"
                          alt=""
                          class="promo-box-image mb-25 raised-sm circle"
                      /></router-link> </div
                    ><!-- / promo-big -->
                    <h5 class="box-title mb-15"
                      >{{ request.requestor.first_name }}
                      {{ request.requestor.last_name }}
                      wants to borrow:
                    </h5>
                    <h6 class="box-description mb-15">{{
                      request.item.name
                    }}</h6> </div
                  ><!-- / promo-container -->
                </div>
              </div>
              <div v-else
                ><h5 class="mt-80"
                  >You have no pending borrow requests.</h5
                ></div
              >
            </div>
            <div class="col-lg-6 pl-lg-5">
              <h2 class="mb-80"
                ><i class="fas fa-users fs-34 mr-5"></i> Friend Requests</h2
              >
              <div v-if="requests.friend_requests.length > 0">
                <div
                  v-for="request in requests.friend_requests"
                  :key="request.id"
                  class="card w-rised-icon lg-icon"
                >
                  <div class="card-body text-center">
                    <div
                      class="rised-icon bg-light circle icon-lg pos-center raised"
                    >
                      <img
                        :src="request.requestor.image_url"
                        class="circle"
                        :alt="
                          `${request.requestor.first_name} ${request.requestor.last_name} Profile Picture`
                        "
                        width="50"/></div
                    ><!-- / rised-icon -->
                    <h5 class="card-title mt-25"
                      >{{ request.requestor.first_name }}
                      {{ request.requestor.last_name }}</h5
                    >
                    <p class="card-text">@{{ request.requestor.username }}</p>
                    <button
                      v-on:click="acceptFriendship(request)"
                      class="btn btn-outline-primary pill mr-25"
                      >Accept</button
                    >
                    <button
                      v-on:click="rejectFriendship(request)"
                      class="btn btn-danger pill"
                      >Reject</button
                    > </div
                  ><!-- / card-body -->
                </div></div
              >
              <div v-else><h5>You have no pending friend requests.</h5></div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
      alertClass: "",
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
