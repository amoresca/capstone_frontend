<template>
  <div class="login">
    <form v-on:submit.prevent="submit()">
      <h1>Login</h1>
      <ul>
        <li class="text-danger" v-for="error in errors" v-bind:key="error">
          {{ error }}
        </li>
      </ul>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" class="form-control" v-model="email" />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control" v-model="password" />
      </div>
      <input type="submit" class="btn btn-primary" value="Submit" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        email: this.email,
        password: this.password
      };
      axios
        .post("/api/sessions", params)
        .then(response => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("username", response.data.username);
          this.$parent.username = response.data.username;
          axios
            .get(`/api/users/${response.data.username}`)
            .then(response => {
              // console.log(response.data);
              this.$parent.currentUser.id = response.data.id;
              this.$parent.currentUser.username = response.data.username;
              this.$parent.currentUser.first_name = response.data.first_name;
              this.$parent.currentUser.last_name = response.data.last_name;
              this.$parent.currentUser.image_url = response.data.image_url;
            })
            .catch(error => {
              console.log(error.response);
            });
          this.$router.push(`/users/${response.data.username}`);
        })
        .catch(error => {
          console.log(error.response);
          this.errors = ["Invalid email or password."];
          this.email = "";
          this.password = "";
        });
    }
  }
};
</script>
