<template>
  <div class="friendships-index">
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <div class="row justify-content-between"
          ><div class="col-md-6"><h1>My Friends</h1></div>

          <div class="col-md-6 text-right"
            ><button
              v-on:click="openFriendModal()"
              class="btn btn-success-gradient m-y-10 mr-10"
              ><i class="fas fa-plus mr-10"></i> Add Friend</button
            ></div
          ></div
        >
      </div>
      <img
        src="/assets/images/angle-light.svg"
        class="img-bottom mt-100"
        alt=""
      />
    </header>
    <div class="main-container"
      ><section id="signup" class="md"
        ><div class="container">
          <div class="form-group row">
            <label for="search-friends" class="col-sm-3 col-form-label"
              ><h4>Search Friends</h4></label
            >
            <div class="col-sm-9">
              <input
                class="form-control"
                type="text"
                v-model="searchFriends"
                id="search-friends"
                placeholder="First name, last name, username..."
              />
            </div>
          </div>

          <div
            v-for="friend in filterBy(friends, searchFriends)"
            :key="friend.id"
            class="card w-rised-icon lg-icon"
          >
            <div class="card-body text-center">
              <div class="rised-icon bg-light circle icon-lg pos-center raised">
                <router-link
                  :to="`/users/${friend.username}`"
                  class="stretched-link"
                  ><img
                    :src="friend.image_url"
                    class="circle"
                    :alt="
                      `${friend.first_name} ${friend.last_name} Profile Picture`
                    "
                    width="50"/></router-link
              ></div>
              <h5 class="card-title mt-25"
                >{{ friend.first_name }} {{ friend.last_name }}</h5
              >
              <p class="card-text">@{{ friend.username }}</p>
              <button v-on:click="deleteFriendship(friend)">
                Remove Friend
              </button>
              <hr /> </div
          ></div>
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
                <li
                  class="text-danger"
                  v-for="error in errors"
                  v-bind:key="error"
                >
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
            </form> </dialog></div></section
    ></div>
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
      errors: []
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
    }
  }
};
</script>
