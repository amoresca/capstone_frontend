<template>
  <div class="signup">
    <header class="pt-200 pb-0 bg-light-grey">
      <div class="container">
        <h1 class="page-title text-primary">Signup</h1>
        <h5 class="mb-30">Create an account to get started</h5> </div
      ><!-- / container -->
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-100" alt="" />
    </header>
    <div class="main-container">
      <section id="signup" class="lg">
        <div class="container">
          <ul>
            <li class="text-danger" v-for="error in errors" v-bind:key="error">
              {{ error }}
            </li>
          </ul>
          <form v-on:submit.prevent="submit()">
            <div class="row">
              <div class="col-md-6 sub-col-left">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="firstName"
                    placeholder=" First Name"
                    required=""
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"
                  /> </div
                ><!-- / form-group --> </div
              ><!-- / column -->

              <div class="col-md-6 sub-col-right">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="lastName"
                    placeholder=" Last Name"
                    required=""
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"
                  /> </div
                ><!-- / form-group --> </div
              ><!-- / column -->

              <div class="col-md-6 sub-col-left">
                <div class="form-group">
                  <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder=" Email"
                    required=""
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"/></div
                ><!-- / form-group --> </div
              ><!-- / column -->

              <div class="col-md-6 sub-col-right">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="username"
                    placeholder=" Username"
                    required=""
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"
                /></div> </div
              ><!-- / column -->

              <div class="col-md-12">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="imageUrl"
                    placeholder=" Image URL (optional)"
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"
                /></div> </div
              ><!-- / column -->

              <div class="col-md-6 sub-col-left">
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    v-model="password"
                    placeholder=" Password"
                    required=""
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"/></div
                ><!-- / form-group --> </div
              ><!-- / column -->

              <div class="col-md-6 sub-col-right">
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    v-model="passwordConfirmation"
                    placeholder=" Confirm Password"
                    required=""
                    style="font-family:'Font Awesome 5 Free', sans-serif !important; font-weight: 600"
                    aria-required="true"
                /></div> </div
              ><!-- / column --></div
            ><!-- / row -->
            <button type="submit" class="btn btn-primary-gradient mt-30">Submit</button>
          </form>
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
