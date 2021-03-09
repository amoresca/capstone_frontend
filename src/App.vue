<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link v-if="!isLoggedIn()" to="/signup">Signup</router-link> |
      <router-link v-if="!isLoggedIn()" to="/login">Login</router-link> |
      <router-link v-if="isLoggedIn()" to="/logout">Logout</router-link>
    </div>
    <div id="sidebar" v-if="isLoggedIn()">
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
export default {
  data: function() {
    return {
      username: ""
    };
  },
  created: function() {
    this.username = localStorage.getItem("username");
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
