<template>
  <div class="friendships-index">
    <h1>My Friends</h1>
    <button v-on:click="openFriendModal()">Add Friend</button>
    <br /><br />
    <label for="">Search Friends</label
    ><input type="text" v-model="searchFriends" /><br />
    <div v-for="friend in filterBy(friends, searchFriends)" :key="friend.id">
      <router-link :to="`/users/${friend.username}`"
        ><img :src="friend.image_url" alt="" width="50"
      /></router-link>
      <router-link :to="`/users/${friend.username}`"
        ><h3>{{ friend.first_name }} {{ friend.last_name }}</h3></router-link
      >
      <p>{{ friend.username }}</p>
      <button v-on:click="deleteFriendship(friend)">
        Remove Friend
      </button>
      <hr />
    </div>
    <dialog>
      <form method="dialog">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
          v-if="alert"
        >
          <strong>{{ alert }}</strong>
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <button>Close</button>
        <h2>Add a Friend</h2>
        <ul>
          <li class="text-danger" v-for="error in errors" v-bind:key="error">
            {{ error }}
          </li>
        </ul>
        <label for="">Search Users: </label
        ><input type="text" v-model="searchUsers" /><br />
        <div v-if="searchUsers">
          <div
            v-for="user in filterBy(
              users,
              searchUsers,
              'first_name',
              'last_name',
              'username'
            )"
            :key="user.id"
          >
            <img :src="user.image_url" alt="" width="50" />
            <h3>{{ user.first_name }} {{ user.last_name }}</h3>
            <p>{{ user.username }}</p>
            <button
              v-if="user.friends == false"
              v-on:click.prevent="createFriendship(user.id)"
            >
              Add Friend
            </button>
            <small v-else>You are already friends with this user</small>
            <hr />
          </div>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      friends: [],
      searchFriends: "",
      users: [],
      searchUsers: "",
      alert: "",
      errors: [],
    };
  },
  created: function() {
    axios.get("/api/friendships").then(response => {
      this.friends = response.data;
    });
  },
  methods: {
    openFriendModal: function() {
      axios.get("/api/users").then(response => {
        this.users = response.data;
        console.log(response.data);
      });
      document.querySelector("dialog").showModal();
    },
    createFriendship: function(userId) {
      axios
        .post("/api/friendships", { requestee_id: userId })
        .then(response => {
          console.log(response.data);
          this.alert = "Friend request sent!";
        })
        .catch(error => {
          console.log(error.response.data);
        });
    },
    deleteFriendship: function(friend) {
      if (confirm("Are you sure you want to remove this friend?")) {
        axios
          .delete(`/api/friendships/${friend.friendship_id}`)
          .then(response => {
            console.log(response.data);
            var index = this.friends.indexOf(friend);
            this.friends.splice(index, 1);
          })
          .catch(error => {
            console.log(error.response.data);
          });
      }
    },
  },
};
</script>
