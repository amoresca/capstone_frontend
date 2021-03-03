<template>
  <div class="my-account">
    <h1>My Account</h1>
    <img :src="user.image_url" alt="" width="50" />Profile Picture
    <button v-on:click="openEditModal()">Edit</button>
    <p>
      <strong>First Name:</strong> {{ user.first_name }}
      <button v-on:click="openEditModal()">Edit</button>
    </p>
    <p>
      <strong>Last Name:</strong> {{ user.last_name }}
      <button v-on:click="openEditModal()">Edit</button>
    </p>
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p>
      <strong>Email:</strong> {{ user.email }}
      <button v-on:click="openEditModal()">Edit</button>
    </p>
    <p>
      <strong>Password:</strong> &bull;&bull;&bull;&bull;&bull;
      <button v-on:click="openEditModal()">Edit</button>
    </p>
    <hr />
    <button>Delete My Account</button>
    <dialog>
      <form method="dialog">
        <h2>Edit Profile</h2>
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
        <button>Close</button>
      </form>
    </dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      user: {},
      password: "",
      passwordConfirmation: "",
    };
  },
  created: function() {
    var username = localStorage.getItem("username");
    axios.get(`/api/users/${username}`).then(response => {
      this.user = response.data;
      console.log(response.data);
    });
  },
  methods: {
    openEditModal: function() {
      document.querySelector("dialog").showModal();
    },
  },
};
</script>
