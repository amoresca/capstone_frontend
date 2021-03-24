<template>
  <div class="friendships-index">
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <div class="row justify-content-between">
          <div class="col-md-6"><h1>My Friends</h1></div>

          <div class="col-md-6 text-right">
            <button
              v-on:click="openFriendModal()"
              class="btn btn-success-gradient m-y-10 mr-10 raised-primary"
            >
              <i class="fas fa-plus mr-10"></i> Add Friend
            </button>
          </div>
        </div>
      </div>
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-100" alt="" />
    </header>
    <div class="main-container">
      <section id="signup" class="md">
        <div class="container">
          <div v-if="friends.length > 0" class="form-group row mb-50 promo-box">
            <label for="search-friends" class="col-sm-3 col-form-label">
              <h4>Search Friends</h4>
            </label>
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
          <div v-else class="text-center">
            <h4 class="mt-80 mb-30">
              You don't have any friends yet!
            </h4>
            <button v-on:click="openFriendModal()" class="btn btn-outline-success mb-80"
              >Click here to find friends</button
            >
          </div>
          <div class="row">
            <div
              class="col-lg-4"
              v-for="friend in filterBy(
                friends,
                searchFriends,
                'first_name',
                'last_name',
                'username'
              )"
              :key="friend.id"
            >
              <div class="card w-rised-icon lg-icon raised move">
                <div class="card-body text-center">
                  <div class="rised-icon bg-light circle icon-lg pos-center raised">
                    <router-link :to="`/users/${friend.username}`">
                      <img
                        :src="friend.image_url"
                        class="circle"
                        :alt="`${friend.first_name} ${friend.last_name} Profile Picture`"
                        width="50"
                      />
                    </router-link>
                  </div>
                  <router-link :to="`/users/${friend.username}`">
                    <h5 class="card-title mt-25"
                      >{{ friend.first_name }} {{ friend.last_name }}</h5
                    >
                  </router-link>
                  <p class="card-text mt-5">@{{ friend.username }}</p>
                  <button
                    v-on:click="deleteFriendship(friend)"
                    class="btn btn-danger btn-xs"
                  >
                    <span class="fas fa-trash"></span>
                    <span class="ml-10">Remove Friend</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="user-search"
            tabindex="-1"
            style="display: none;"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Add a Friend</h4>
                  <button
                    type="button"
                    class="close btn btn-icon mr-5"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button></div
                ><!-- / modal-header -->
                <div class="modal-body">
                  <div class="container full-width">
                    <form>
                      <div
                        class="alert alert-success alert-dismissible fade show"
                        role="alert"
                        v-if="alert"
                        ><span class="far fa-check-square fs-22 mr-15"></span>
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
                      <ul>
                        <li
                          class="text-danger"
                          v-for="error in errors"
                          v-bind:key="error"
                        >
                          {{ error }}
                        </li>
                      </ul>
                      <div class="form-inline">
                        <div class="form-group mb-20 p-3 w-100">
                          <label for="search-users">Search Users</label>
                          <input
                            class="form-control flex-grow-1 ml-20"
                            type="text"
                            v-model="searchUsers"
                            id="search-users"
                            placeholder="First name, last name, username..."
                          />
                        </div>
                      </div>
                      <div class="row" v-if="searchUsers">
                        <div
                          class="col-lg-6 d-flex mb-3"
                          v-for="user in filterBy(
                            users,
                            searchUsers,
                            'first_name',
                            'last_name',
                            'username'
                          )"
                          :key="user.id"
                        >
                          <div class="mr-20" style="width:80px;"
                            ><img :src="user.image_url" alt="" class="circle"
                          /></div>
                          <div class="">
                            <p class="mb-0">
                              <a href="#" v-on:click.prevent="viewUser(user.username)">
                                <strong
                                  >{{ user.first_name }} {{ user.last_name }}</strong
                                >
                              </a>
                            </p>
                            <p>@{{ user.username }}</p>
                            <button
                              class="btn btn-primary btn-xs mt-5"
                              v-if="user.friends == false"
                              v-on:click.prevent="createFriendship(user.id)"
                            >
                              Add Friend
                            </button>
                            <small v-else>You are already friends with this user</small>
                          </div>
                        </div>
                      </div>
                    </form></div
                  ><!-- / container --> </div
                ><!-- / modal-body -->
                <div class="modal-footer"> </div
                ><!-- / modal-footer --> </div
              ><!-- / modal-content --> </div
            ><!-- / modal-dialog -->
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";
/*global $*/

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
      $("#user-search").modal("show");
    },
    viewUser: function(username) {
      $("#user-search").modal("hide");
      this.$router.push(`/users/${username}`);
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
