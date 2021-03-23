<template>
  <div id="app">
    <!-- <div id="preloader">
      <div class="preloader">
        <span></span>
        <span></span>
      </div>
    </div> -->

    <div id="top"></div>

    <nav
      class="navbar navbar-expand-lg navbar-light has-sticky-logo main-nav fixed-top nav-scroll"
    >
      <div class="sticky-nav-activate fixed-top"></div>
      <div class="container">
        <router-link class="navbar-brand sticky-logo fs-24 mr-20 text-primary" to="/"
          >Borrowr</router-link
        >
        <button
          class="navbar-toggler collapsed"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-toggle"
          aria-controls="navbar-toggle"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="icon-bar top-bar"></span>
          <span class="icon-bar middle-bar"></span>
          <span class="icon-bar bottom-bar"></span>
          <span class="sr-only">Toggle navigation</span> </button
        ><!-- / navbar-toggler -->

        <div class="collapse navbar-collapse" id="navbar-toggle">
          <ul v-if="!isLoggedIn()" class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link to="/login" class="nav-link smooth-scroll">Login</router-link>
            </li>
          </ul>

          <ul v-if="isLoggedIn()" class="navbar-nav m-auto">
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="`/users/${currentUser().username}`"
                key="$route.path"
                ><i class="fas fa-boxes fs-14 mr-5"></i> My Stuff</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/friends"
                ><i class="fas fa-users fs-14 mr-5"></i> Friends</router-link
              ></li
            >
            <li class="nav-item">
              <router-link class="nav-link" to="/items"
                ><i class="fas fa-people-arrows fs-14 mr-5"></i> Borrow</router-link
              ></li
            >
            <li id="notifications" class="nav-item" :class="{ 'unread dropdown': !read }">
              <router-link
                class="nav-link"
                :class="{ 'dropdown-toggle': !read }"
                to="/requests"
                ><i class="fas fa-bell fs-14 mr-5"></i> Requests</router-link
              ><div class="dropdown-menu" aria-labelledby="dropdown-center-nav"
                ><div
                  v-for="request in orderBy(requests, 'created_at', -1)"
                  :key="request.created_at"
                >
                  <div v-if="!request.read">
                    <!-------- Borrow Request for available item -------->
                    <div
                      class="dropdown-item"
                      v-if="request.item && request.item.available"
                    >
                      <p
                        >{{ request.requestor.first_name }}
                        {{ request.requestor.last_name }} wants to borrow
                        {{ request.item.name }}.&nbsp;<small>{{
                          relativeDate(request.created_at)
                        }}</small></p
                      >
                      <button
                        class="btn btn-info btn-xs"
                        v-on:click="acceptBorrowRequest(request)"
                        >Accept</button
                      >
                      <button
                        class="btn btn-secondary btn-xs"
                        v-on:click="rejectBorrowRequest(request)"
                        >Reject</button
                      >
                      <button
                        class="btn btn-xs btn-icon btn-circle btn-secondary ml-10"
                        v-on:click.prevent="markAsRead(request)"
                        ><i class="fas fa-times"></i
                      ></button>
                    </div>
                    <!-------- Waitlist (Borrow Request for unavailable item) -------->
                    <div
                      class="dropdown-item"
                      v-else-if="request.item && !request.item.available"
                    >
                      <p
                        >{{ request.requestor.first_name }}
                        {{ request.requestor.last_name }} has been added to the waitlist
                        for {{ request.item.name }}.&nbsp;<small>{{
                          relativeDate(request.created_at)
                        }}</small></p
                      >
                      <button
                        class="btn btn-xs btn-icon btn-circle btn-secondary ml-10"
                        v-on:click.prevent="markAsRead(request)"
                        ><i class="fas fa-times"></i
                      ></button>
                      <hr />
                    </div>
                    <!-------- Friend Request -------->
                    <div class="dropdown-item" v-else>
                      <p
                        >{{ request.requestor.first_name }}
                        {{ request.requestor.last_name }} sent you a friend
                        request.&nbsp;<small>{{
                          relativeDate(request.created_at)
                        }}</small></p
                      >
                      <button
                        class="btn btn-info btn-xs"
                        v-on:click="acceptFriendship(request)"
                        >Accept</button
                      >
                      <button
                        class="btn btn-secondary btn-xs"
                        v-on:click="rejectFriendship(request)"
                        >Reject</button
                      >
                      <button
                        class="btn btn-xs btn-icon btn-circle btn-secondary ml-10"
                        v-on:click.prevent="markAsRead(request)"
                        ><i class="fas fa-times"></i
                      ></button>
                    </div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" to="/requests"
                  >View all requests</router-link
                ></div
              ><!-- / dropdown-menu --></li
            > </ul
          ><!-- / navbar-nav -->

          <ul v-if="!isLoggedIn()" class="navbar-button p-0 m-0 ml-30">
            <li class="nav-item">
              <router-link to="/signup" class="btn btn-sm btn-primary-gradient">
                <span>Signup</span></router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav ml-20"
            ><li class="nav-item dropdown" v-if="isLoggedIn()">
              <router-link
                class="nav-link dropdown-toggle px-0 pt-20 pb-0"
                id="dropdown-center-nav"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                to="/my-account"
                ><img
                  :src="currentUser().image_url"
                  alt=""
                  class="promo-box-image circle mb-25 raised-sm"
                  style="width:35px;"
              /></router-link>
              <div class="dropdown-menu" aria-labelledby="dropdown-center-nav">
                <div class="dropdown-item">
                  <h6 class="box-title mb-15"
                    >{{ currentUser().first_name }} {{ currentUser().last_name }}</h6
                  >
                  <p>@{{ currentUser().username }}</p>
                </div>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" to="/my-account"
                  >My Account</router-link
                ><router-link to="/logout" class="dropdown-item">Logout</router-link></div
              ><!-- / dropdown-menu --></li
            ></ul
          >
        </div></div
      > </nav
    ><!-- / navbar -->
    <router-view :key="$route.fullPath" />

    <a href="#top" class="scroll-to-top smooth-scroll" data-nav-status="toggle"
      ><i class="fas fa-chevron-up"></i
    ></a>

    <footer class="big bg-primary dark pt-0">
      <img src="/assets/images/angle-up-light.svg" alt="" class="img-top mb-60" />
      <div class="container">
        <div class="row v-center mobile-center">
          <div class="col-md-4 footer-left-area tablet-top">
            <p
              >© Neumo by
              <a href="https://kingstudio.ro" target="_blank">KingStudio</a></p
            >
          </div>
          <div class="col-md-8 footer-right-area"> </div>
        </div>
      </div>
    </footer>
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
      requests: "",
      read: true
    };
  },
  created: function() {
    if (this.isLoggedIn()) {
      axios.get("/api/borrow-requests").then(response => {
        this.requests = response.data.borrow_requests.concat(
          response.data.friend_requests
        );
        if (this.requests.find(request => !request.read)) {
          this.read = false;
        }
        console.log(this.requests);
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
          this.read = false;
          this.requests.unshift(data); // update the messages in real time
        }
      });
    }
  },
  methods: {
    isLoggedIn: function() {
      return localStorage.getItem("jwt");
    },
    isCurrentUser: function() {
      return this.currentUser().username == this.$route.params.username;
    },
    setCurrentUser: function(data) {
      var userObject = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        image_url: data.image_url
      };
      localStorage.setItem("user", JSON.stringify(userObject));
    },
    currentUser: function() {
      return JSON.parse(localStorage.user);
    },
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
