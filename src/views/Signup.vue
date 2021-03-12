<template>
  <div class="signup">
    <header class="pt-200 pb-0 bg-light-grey">
      <div class="container">
        <h1 class="page-title text-primary">Signup</h1>
        <h5 class="mb-30">Create an account to get started</h5> </div
      ><!-- / container -->
      <img
        src="/assets/images/angle-light.svg"
        class="img-bottom mt-100"
        alt=""
      />
    </header>
    <div class="main-container"
      ><section id="signup" class="lg"
        ><div class="container"
          ><ul>
            <li class="text-danger" v-for="error in errors" v-bind:key="error">
              {{ error }}
            </li>
          </ul>
          <form v-on:submit.prevent="submit()">
            <div class="form-group">
              <label>First Name:</label>
              <input type="text" class="form-control" v-model="firstName" />
            </div>
            <div class="form-group">
              <label>Last Name:</label>
              <input type="text" class="form-control" v-model="lastName" />
            </div>
            <div class="form-group">
              <label>Username:</label>
              <input type="text" class="form-control" v-model="username" />
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" class="form-control" v-model="email" />
            </div>
            <div class="form-group">
              <label>Password:</label>
              <input type="password" class="form-control" v-model="password" />
            </div>
            <div class="form-group">
              <label>Password confirmation:</label>
              <input
                type="password"
                class="form-control"
                v-model="passwordConfirmation"
              />
            </div>
            <div class="form-group">
              <label>Image URL:</label>
              <input type="text" class="form-control" v-model="imageUrl" />
            </div>
            <input
              type="submit"
              class="btn btn-primary"
              value="Submit"
            /> </form></div></section
    ></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      email: "",
      password: "",
      passwordConfirmation: "",
      username: "",
      firstName: "",
      lastName: "",
      imageUrl: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
        username: this.username,
        first_name: this.firstName,
        last_name: this.lastName,
        image_url: this.imageUrl
      };
      axios
        .post("/api/users", params)
        .then(response => {
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
