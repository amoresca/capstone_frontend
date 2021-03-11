<template>
  <div id="app">
    <!-- <div id="preloader">
      <div class="preloader">
        <span></span>
        <span></span>
      </div>
    </div> -->

    <div id="top"> </div
    ><!-- / top -->

    <nav
      class="navbar navbar-expand-lg navbar-light has-sticky-logo main-nav fixed-top nav-scroll"
    >
      <div class="sticky-nav-activate fixed-top"></div>
      <div class="container">
        <router-link class="navbar-brand" to="/">BorrowApp</router-link>
        <a class="navbar-brand sticky-logo" href="index.html"
          ><img src="assets/images/logo.png" alt=""
        /></a>
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
          <ul class="navbar-nav m-auto">
            <li class="nav-item" v-if="!isLoggedIn()">
              <router-link to="/login" class="nav-link smooth-scroll"
                >Login</router-link
              >
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link
                class="nav-link smooth-scroll"
                :to="`/users/${username}`"
                key="$route.path"
                ><i class="fas fa-boxes fs-14 mr-5"></i> My Stuff</router-link
              ></li
            >
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link class="nav-link smooth-scroll" to="/friends"
                ><i class="fas fa-users fs-14 mr-5"></i> Friends</router-link
              ></li
            >
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link class="nav-link smooth-scroll" to="/items"
                ><i class="fas fa-people-arrows fs-14 mr-5"></i>
                Borrow</router-link
              ></li
            >
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link class="nav-link smooth-scroll" to="/requests"
                ><i class="fas fa-bell fs-14 mr-5"></i> Requests</router-link
              ></li
            >
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link class="nav-link smooth-scroll" to="/my-account"
                ><i class="fas fa-cog fs-14 mr-5"></i> My Account</router-link
              ></li
            > </ul
          ><!-- / navbar-nav -->

          <ul class="navbar-button p-0 m-0 ml-30">
            <li class="nav-item">
              <router-link
                v-if="!isLoggedIn()"
                to="/signup"
                class="btn btn-sm btn-primary-gradient"
                ><i class="fas fa-shopping-cart fs-14 mr-5"></i>
                <span>Signup</span></router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav auto"
            ><li class="nav-item" v-if="isLoggedIn()">
              <router-link to="/logout" class="nav-link smooth-scroll"
                >Logout</router-link
              >
            </li></ul
          >
        </div></div
      > </nav
    ><!-- / navbar -->
    <!-- <div id="sidebar" v-if="isLoggedIn()">
      <img
        src="https://immedilet-invest.com/wp-content/uploads/2016/01/user-placeholder.jpg"
        alt=""
        width="50"
      /><strong
        >{{ currentUser.first_name }} {{ currentUser.last_name }}</strong
      >
      @{{ currentUser.username }}
    </div> -->
    <router-view />

    <a
      href="#top"
      class="scroll-to-top is-hidden smooth-scroll"
      data-nav-status="toggle"
      ><i class="fas fa-chevron-up"></i
    ></a>

    <!-- <footer class="big bg-primary dark">
      <div class="container">
        <div class="row v-center mobile-center">
          <div class="col-md-4 footer-left-area tablet-top">
            <p
              >© Neumo by
              <a href="https://kingstudio.ro" target="_blank">KingStudio</a></p
            > </div
          >
          <div class="col-md-8 footer-right-area">
            <p>
              <a href="index.html" class="text-link mr-20">Home</a>
              <a href="index.html#landing-pages" class="text-link mr-20"
                >Landing Pages</a
              >
              <a href="index.html#templates" class="text-link mr-20"
                >Templates</a
              >
              <a href="components.html" class="text-link">Components</a>
            </p> </div
          > </div
        > </div
      >
    </footer> -->
  </div>
</template>

<style></style>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      username: "",
      currentUser: {}
    };
  },
  created: function() {
    this.username = localStorage.getItem("username");
    if (this.username) {
      axios
        .get(`/api/users/${this.username}`)
        .then(response => {
          // console.log(response.data);
          this.currentUser.id = response.data.id;
          this.currentUser.username = response.data.username;
          this.currentUser.first_name = response.data.first_name;
          this.currentUser.last_name = response.data.last_name;
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  },
  methods: {
    isLoggedIn: function() {
      return localStorage.getItem("jwt");
    },
    isCurrentUser: function() {
      return this.username == this.$route.params.username;
    }
  }
};
</script>
