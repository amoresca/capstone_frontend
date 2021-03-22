<template>
  <div class="my-account">
    <header class="pt-200 pb-0 bg-primary dark text-center">
      <div class="container pt-70 pb-50">
        <h1 class="fs-70">My Account</h1>
        <h5 class="mb-30">View and update your account settings</h5> </div
      ><!-- / container -->
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-200" alt="" />
    </header>
    <div class="main-container">
      <section class="lg">
        <div class="container">
          <div class="table-overflow">
            <table class="table table-xl">
              <tbody>
                <tr>
                  <td><b>Profile Picture</b></td>
                  <td
                    ><img :src="user.image_url" alt="" class="circle" style="width:150px"
                  /></td>
                  <td class="text-right"
                    ><a
                      href="#"
                      v-on:click.prevent="openEditModal()"
                      class="btn btn-icon btn-success btn-circle"
                      ><span class="fas fa-pencil-alt"></span></a
                  ></td>
                </tr>
                <tr>
                  <td><b>First Name</b></td>
                  <td>{{ user.first_name }}</td>
                  <td class="text-right"
                    ><a
                      href="#"
                      v-on:click.prevent="openEditModal()"
                      class="btn btn-icon btn-success btn-circle"
                      ><span class="fas fa-pencil-alt"></span></a
                  ></td>
                </tr>
                <tr>
                  <td><b>Last Name</b></td>
                  <td>{{ user.last_name }}</td>
                  <td class="text-right"
                    ><a
                      href="#"
                      v-on:click.prevent="openEditModal()"
                      class="btn btn-icon btn-success btn-circle"
                      ><span class="fas fa-pencil-alt"></span></a
                  ></td>
                </tr>
                <tr>
                  <td><b>Username</b></td>
                  <td>@{{ user.username }}</td>
                  <td class="text-right"></td>
                </tr>
                <tr>
                  <td><b>Email</b></td>
                  <td>{{ user.email }}</td>
                  <td class="text-right"
                    ><a
                      href="#"
                      v-on:click.prevent="openEditModal()"
                      class="btn btn-icon btn-success btn-circle"
                      ><span class="fas fa-pencil-alt"></span></a
                  ></td>
                </tr>
                <tr>
                  <td><b>Password</b></td>
                  <td>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</td>
                  <td class="text-right"
                    ><a
                      href="#"
                      v-on:click.prevent="openEditModal()"
                      class="btn btn-icon btn-success btn-circle"
                      ><span class="fas fa-pencil-alt"></span></a
                  ></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button v-on:click="deleteUser()" class="btn btn-danger my-5 mr-10"
            >Delete My Account</button
          >
          <dialog>
            <form method="dialog">
              <h2>Edit Profile</h2>
              <ul>
                <li class="text-danger" v-for="error in errors" v-bind:key="error">
                  {{ error }}
                </li>
              </ul>
              <div class="form-group">
                <label>Profile Picture:</label>
                <input type="text" class="form-control" v-model="user.image_url" />
              </div>
              <div class="form-group">
                <label>First Name:</label>
                <input type="text" class="form-control" v-model="user.first_name" />
              </div>
              <div class="form-group">
                <label>Last Name:</label>
                <input type="text" class="form-control" v-model="user.last_name" />
              </div>
              <div class="form-group">
                <label>Email:</label>
                <input type="email" class="form-control" v-model="user.email" />
              </div>
              <hr />
              <div class="form-group">
                <label>New Password:</label>
                <input type="password" class="form-control" v-model="password" />
              </div>
              <div class="form-group">
                <label>Password Confirmation:</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="passwordConfirmation"
                />
              </div>
              <button
                v-on:click.prevent="editUser()"
                class="btn btn-success-gradient m-y-10 mr-10"
                >Update</button
              >
              <button>Close</button>
            </form>
          </dialog>

          <!--- Modal --->
          <div
            class="modal fade default-modal"
            id="edit-account"
            tabindex="-1"
            style="display: none;"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header"> <h6 class="modal-title">Edit Profile</h6> </div
                ><!-- / modal-header -->
                <div class="modal-body">
                  <div class="container full-width">
                    <ul v-if="errors">
                      <li class="text-danger" v-for="error in errors" v-bind:key="error">
                        {{ error }}
                      </li>
                    </ul>
                    <div class="form-inline">
                      <div class="form-group w-100 mb-15">
                        <label class="mr-20 justify-content-start">Profile Picture</label>
                        <input
                          type="text"
                          class="form-control flex-grow-1"
                          v-model="user.image_url"
                        />
                      </div>
                      <div class="form-group w-100 mb-15">
                        <label class="mr-20 justify-content-start">First Name</label>
                        <input
                          type="text"
                          class="form-control flex-grow-1"
                          v-model="user.first_name"
                        />
                      </div>
                      <div class="form-group w-100 mb-15">
                        <label class="mr-20 justify-content-start">Last Name</label>
                        <input
                          type="text"
                          class="form-control flex-grow-1"
                          v-model="user.last_name"
                        />
                      </div>
                      <div class="form-group w-100 mb-15">
                        <label class="mr-20 justify-content-start">Email</label>
                        <input
                          type="email"
                          class="form-control flex-grow-1"
                          v-model="user.email"
                        />
                      </div>
                    </div>
                    <hr />
                    <div class="form-inline">
                      <div class="form-group w-100 mb-15">
                        <label class="mr-20 justify-content-start">New Password:</label>
                        <input
                          type="password"
                          class="form-control flex-grow-1"
                          v-model="password"
                        />
                      </div>
                      <div class="form-group w-100 mb-15">
                        <label class="mr-20 justify-content-start"
                          >Password Confirmation:</label
                        >
                        <input
                          type="password"
                          class="form-control flex-grow-1"
                          v-model="passwordConfirmation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-sm btn-warning mr-10"
                    data-dismiss="modal"
                    aria-label="Close"
                    >Close</button
                  >
                  <button v-on:click.prevent="editUser()" class="btn btn-sm btn-success"
                    >Save</button
                  ></div
                ><!-- / modal-footer --> </div
              ><!-- / modal-content --> </div
            ><!-- / modal-dialog -->
          </div>
        </div>
      </section></div
    ><!-- / main-container -->
  </div>
</template>

<script>
import axios from "axios";
/*global $*/

export default {
  data: function() {
    return {
      user: {},
      password: "",
      passwordConfirmation: "",
      errors: ""
    };
  },
  created: function() {
    var username = this.$parent.currentUser().username;
    axios.get(`/api/users/${username}`).then(response => {
      this.user = response.data;
      // console.log(response.data);
    });
  },
  methods: {
    openEditModal: function() {
      $("#edit-account").modal("show");
    },
    editUser: function() {
      var username = this.$parent.currentUser().username;
      var params = {
        email: this.user.email,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        image_url: this.user.image_url
      };
      if (this.password) {
        params.password = this.password;
        params.password_confirmation = this.passwordConfirmation;
      }
      axios
        .patch(`/api/users/${username}`, params)
        .then(response => {
          // console.log(response.data);
          this.$parent.setCurrentUser(response.data);

          $("#edit-account").modal("hide");
          this.password = "";
          this.passwordConfirmation = "";
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    deleteUser: function() {
      if (confirm("Are you sure you want to delete your account?")) {
        axios
          .delete(`/api/users/${this.user.username}`)
          .then(response => {
            console.log(response.data);
            this.$router.push("/logout");
          })
          .catch(error => {
            console.log(error.response.data);
          });
      }
    }
  }
};
</script>
