<template>
  <div class="items-index" v-if="items">
    <!-- Alert -->
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
    <h1>Friends' Items</h1>
    <div class="items" v-if="items.length > 0">
      <label for="">Search by name: </label
      ><input type="text" v-model="searchName" />
      <label for="">Category: </label
      ><select name="" id="" v-model="searchCategory">
        <option value="">All Categories</option>
        <option
          v-for="category in categories"
          :value="category.id"
          :key="category.id"
          >{{ category.name }}</option
        >
      </select>
      <div
        v-for="item in filterBy(
          filterBy(items, searchCategory, 'category.id'),
          searchName,
          'name'
        )"
        :key="item.id"
        :class="{ unavailable: !item.available }"
      >
        <h3>{{ item.name }}</h3>
        <img :src="item.image_url" alt="" width="100" /><br />
        <p>{{ item.category.name }}</p>
        <router-link :to="`/users/${item.user.username}`"
          ><strong
            >Owner: {{ item.user.first_name }} {{ item.user.last_name }}
            <img
              :src="item.user.image_url"
              alt=""
              width="50"/></strong></router-link
        ><br />
        <button v-on:click="openShowModal(item)">
          View Info
        </button>
      </div>
    </div>
    <p v-else>
      Looks like you haven't added any friends yet.<br />
      <router-link to="/friends"><button>Add Friends</button></router-link>
    </p>

    <!-- Show Dialog -->
    <dialog>
      <form method="dialog" v-if="currentItem">
        <h2>{{ currentItem.name }}</h2>
        <h3>{{ currentItem.category.name }}</h3>
        <img :src="currentItem.image_url" :alt="currentItem.name" width="200" />
        <button
          v-if="currentItem.available"
          v-on:click.prevent="createBorrowRequest(currentItem)"
        >
          Request to Borrow
        </button>
        <button v-else v-on:click.prevent="createWaitlistRequest(currentItem)"
          >Add Me to Waitlist</button
        >
        <hr />
        <button>Close</button>
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
      items: "",
      categories: "",
      searchName: "",
      searchCategory: "",
      currentItem: "",
      errors: [],
      alert: ""
    };
  },
  created: function() {
    axios.get("/api/items").then(response => {
      this.items = response.data;
    });
    axios.get("/api/categories").then(response => {
      this.categories = response.data;
      // console.log(response.data);
    });
  },
  methods: {
    openShowModal: function(item) {
      this.currentItem = item;
      // console.log(this.currentItem);
      document.querySelector("dialog").showModal();
    },
    createBorrowRequest: function(item) {
      axios
        .post("/api/borrow-requests", { item_id: item.id })
        .then(response => {
          console.log(response.data);
          this.alert = "Borrow request sent!";
          document.querySelector("dialog").close();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    createWaitlistRequest: function(item) {
      axios
        .post("/api/borrow-requests", { item_id: item.id })
        .then(response => {
          console.log(response.data);
          this.alert = "You've been added to the waitlist.";
          document.querySelector("dialog").close();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
