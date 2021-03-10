<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link v-if="!isLoggedIn()" to="/signup">Signup</router-link> |
      <router-link v-if="!isLoggedIn()" to="/login">Login</router-link> |
      <router-link v-if="isLoggedIn()" to="/logout">Logout</router-link>
    </div>
    <div id="sidebar" v-if="isLoggedIn()">
      <img
        src="https://immedilet-invest.com/wp-content/uploads/2016/01/user-placeholder.jpg"
        alt=""
        width="50"
      /><strong
        >{{ currentUser.first_name }} {{ currentUser.last_name }}</strong
      >
      @{{ currentUser.username }}
      <hr />
      <router-link to="/my-account">My Account</router-link> |
      <router-link :to="`/users/${username}`" key="$route.path"
        >My Items</router-link
      >
      | <router-link to="/friends">Friends</router-link> |
      <router-link to="/items">Friends' Items</router-link> |
      <router-link to="/requests">Requests</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

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
