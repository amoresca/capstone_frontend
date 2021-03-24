<template>
  <div class="requests" v-if="requests">
    <!------------------- Header ------------------->
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <h1>Requests</h1>
      </div>
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-100" alt="" />
    </header>
    <div class="main-container">
      <section class="lg">
        <div class="container">
          <!------------------- Alerts ------------------->
          <div
            class="alert alert-warning alert-dismissible fade show"
            role="alert"
            v-if="alert"
          >
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true" class="fas fa-times fs-16"></span>
            </button>
            <span class="fas fa-exclamation-circle fs-22 mr-15"></span>
            <strong>{{ alert }}</strong>
          </div>
          <div class="row">
            <!------------------- Borrow Requesets ------------------->
            <div class="col-lg-6 pr-lg-5">
              <h2 class="section-title mb-50 h3 text-center">Borrow Requests</h2>
              <div v-if="requests.borrow_requests.length > 0">
                <div
                  class="promo-box row p-20"
                  v-for="request in filterBy(
                    requests.borrow_requests,
                    true,
                    'item.available'
                  )"
                  :key="request.id"
                >
                  <div class="col-sm-4 col-md-6 col-lg-4 col-xl-6 pl-0">
                    <img
                      :src="request.item.image_url"
                      alt=""
                      class="rounded-10 raised-sm mb-15"
                    />
                  </div>
                  <div
                    class="col-sm-8 col-md-6 col-lg-8 col-xl-6 d-flex flex-column justify-content-center"
                  >
                    <div>
                      <router-link
                        :to="`/users/${request.requestor.username}`"
                        class="float-left mr-10"
                      >
                        <img
                          :src="request.requestor.image_url"
                          alt=""
                          class="mb-2 mb-xl-4 raised-sm circle"
                          style="width:50px;"
                        />
                      </router-link>
                      <p class="mb-2 mb-xl-4"
                        >{{ request.requestor.first_name }}
                        {{ request.requestor.last_name }}<br />
                        wants to borrow
                      </p>
                    </div>
                    <h6 class="box-title mb-2 mb-xl-4" style="clear:both">{{
                      request.item.name
                    }}</h6>

                    <div
                      ><button
                        v-on:click="acceptBorrowRequest(request)"
                        class="btn btn-outline-primary mr-10 btn-sm p-x-30 p-y-10"
                        >Accept</button
                      >
                      <button
                        v-on:click="rejectBorrowRequest(request)"
                        class="btn btn-danger btn-sm"
                        >Reject</button
                      ></div
                    ></div
                  >
                </div>
                <h3 class="mt-50 mb-20 text-center h4">
                  <i class="fas fa-clipboard-list mr-5"></i> Waitlist
                </h3>
                <div
                  class="promo-box promo-left p-20"
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
                    <p class="ml-15 mb-5 pt-10"
                      >{{ request.requestor.first_name }} {{ request.requestor.last_name
                      }}<br class="d-none d-lg-block" />
                      wants to borrow
                    </p>
                    <h6 class="ml-15 box-title">{{ request.item.name }}</h6> </div
                  ><!-- / promo-container -->
                  <div class="text-right">
                    <small>{{ $parent.relativeDate(request.created_at) }}</small>
                  </div>
                </div>
              </div>
              <div v-else>
                <h5 class="mt-80 text-center">
                  You have no pending borrow requests.
                </h5>
              </div>
            </div>
            <!------------------- Friend Requests ------------------->
            <div class="col-lg-6 pl-lg-5 mt-4 mt-lg-0">
              <h2 class="section-title mb-80 h3 text-center">Friend Requests</h2>
              <div v-if="requests.friend_requests.length > 0">
                <div
                  v-for="request in requests.friend_requests"
                  :key="request.id"
                  class="card w-rised-icon lg-icon mb-70"
                >
                  <div class="card-body text-center">
                    <div class="rised-icon bg-light circle icon-lg pos-center raised">
                      <router-link :to="`/users/${request.requestor.username}`">
                        <img
                          :src="request.requestor.image_url"
                          class="circle"
                          :alt="
                            `${request.requestor.first_name} ${request.requestor.last_name} Profile Picture`
                          "
                          width="50"
                        /> </router-link></div
                    ><!-- / rised-icon -->
                    <router-link :to="`/users/${request.requestor.username}`"
                      ><h5 class="card-title mt-25"
                        >{{ request.requestor.first_name }}
                        {{ request.requestor.last_name }}</h5
                      ></router-link
                    >
                    <p class="card-text mt-5">@{{ request.requestor.username }}</p>
                    <button
                      v-on:click="acceptFriendship(request)"
                      class="btn btn-outline-primary mr-10 btn-sm p-x-30 p-y-10"
                      >Accept</button
                    >
                    <button
                      v-on:click="rejectFriendship(request)"
                      class="btn btn-danger btn-sm"
                      >Reject</button
                    > </div
                  ><!-- / card-body -->
                </div></div
              >
              <div v-else
                ><h5 class="text-center">You have no pending friend requests.</h5></div
              >
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
    this.getBorrowRequests();
  },
  methods: {
    getBorrowRequests: function() {
      axios.get("/api/borrow-requests").then(response => {
        this.requests = response.data;
        console.log(response.data);
      });
    },
    acceptBorrowRequest: function(request) {
      axios
        .patch(`/api/borrow-requests/${request.id}`, { status: "accepted" })
        .then(response => {
          this.alert = response.data.message;
          this.getBorrowRequests();
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
          var index = this.requests.borrow_requests.indexOf(request);
          this.requests.borrow_requests.splice(index, 1);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    acceptFriendship: function(request) {
      axios
        .patch(`/api/friendships/${request.id}`, { status: "accepted" })
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
          // this.alert = "Friend request removed.";
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
