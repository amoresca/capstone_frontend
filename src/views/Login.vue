<template>
  <div class="login">
    <div class="main-container">
      <section id="signup" class="xl">
        <div class="container">
          <div class="row">
            <div class="col-xl-8 mx-auto">
              <h1 class="mb-40">Login</h1>
              <ul>
                <li class="text-danger" v-for="error in errors" v-bind:key="error">
                  {{ error }}
                </li>
              </ul>
              <form v-on:submit.prevent="submit()" class="form-inline">
                <div class="form-group w-100 mb-15">
                  <label class="mr-50 justify-content-start">Email</label>
                  <input type="email" class="form-control flex-grow-1" v-model="email" />
                </div>
                <div class="form-group w-100 mb-15">
                  <label class="mr-20 justify-content-start">Password</label>
                  <input
                    type="password"
                    class="form-control flex-grow-1"
                    v-model="password"
                  />
                </div>
                <input
                  type="submit"
                  class="btn btn-primary-gradient mt-30"
                  value="Submit"
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
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
          // Set default header
          axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;

          // Store user info in localstorage
          localStorage.setItem("jwt", response.data.jwt);
          this.$parent.setCurrentUser(response.data);

          // Redirect to My Items page
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
