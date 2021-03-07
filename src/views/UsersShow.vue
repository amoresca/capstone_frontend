<template>
  <div class="users-show">
    <div v-if="$parent.isCurrentUser()">
      <h1>My Items</h1>
      <button v-on:click="toggleForm()">Add Item</button><br />
      <div v-if="showForm">
        <h2>Add an Item</h2>
        <form v-on:submit.prevent="createItem()">
          <label for="">Name: </label><input type="text" v-model="newName" />
          <label for="">Image URL: </label
          ><input type="text" v-model="newImage" />
          <label for="">Category: </label
          ><select name="" id="" v-model="newCategory">
            <option value="">Choose a Category</option>
            <option
              v-for="category in categories"
              :value="category.id"
              :key="category.id"
              >{{ category.name }}</option
            ></select
          >
          <button>Add Item</button>
        </form>
        <hr />
      </div>
    </div>
    <div v-else>
      <img :src="user.image_url" alt="" width="50" />
      <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      <h3>@{{ user.username }}</h3>
      <button v-if="user.friends == true">Remove Friend</button>
      <button v-if="user.friends == false">Add Friend</button>
    </div>

    <div class="items">
      <label for="">Search by name: </label
      ><input type="text" v-model="searchName" />
      <label for="">Category: </label
      ><select name="" id="" v-model="searchCategory">
        <option value="0">Choose a Category</option>
        <option
          v-for="category in categories"
          :value="category.id"
          :key="category.id"
          >{{ category.name }}</option
        >
      </select>
      <div
        v-for="item in filterBy(user.items, searchName, 'name')"
        :key="item.id"
        :class="{ unavailable: !item.available }"
      >
        <h3>{{ item.name }}</h3>
        <img :src="item.image_url" alt="" width="100" /><br />
        <button v-if="$parent.isCurrentUser()">Edit</button>
        <div v-if="!item.available && $parent.isCurrentUser()">
          <strong>Currently borrowed by:</strong>
        </div>
      </div>
    </div>

    <div v-if="$parent.isCurrentUser()">
      <hr />
      <h2>Borrowed Items</h2>
      <div v-for="item in user.borrowed_items" :key="item.id">
        <h3>{{ item.name }}</h3>
        <img :src="item.image_url" alt="" width="100" /><br />
        <strong>Belongs to: </strong>{{ item.user.first_name }}
        {{ item.user.last_name }}
        <img :src="item.user.image_url" alt="" width="50" />
      </div>
    </div>
  </div>
</template>

<style>
.unavailable {
  background-color: #dedede;
}
</style>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      user: {},
      categories: [],
      showForm: false,
      newName: "",
      newCategory: "",
      newImage: "",
      searchName: "",
      searchCategory: 0,
      errors: [],
    };
  },
  created: function() {
    this.getUser();
    axios.get("/api/categories").then(response => {
      this.categories = response.data;
      // console.log(response.data);
    });
  },
  watch: {
    $route: {
      handler: "getUser",
      immediate: true,
    },
  },
  methods: {
    getUser: function() {
      axios.get(`/api/users/${this.$route.params.username}`).then(response => {
        this.user = response.data;
        // console.log(response.data);
      });
    },
    toggleForm: function() {
      this.showForm = true;
    },
    createItem: function() {
      var params = {
        name: this.newName,
        image_url: this.newImage,
        category_id: this.newCategory,
      };
      axios.post("/api/items", params);
    },
  },
};
</script>
