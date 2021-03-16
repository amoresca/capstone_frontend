<template>
  <div class="users-show" v-if="user">
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <div v-if="$parent.isCurrentUser()" class="row justify-content-between">
          <div class="col-md-6">
            <h1>My Items</h1>
          </div>
          <div class="col-md-6 text-right">
            <button
              v-on:click="toggleForm()"
              class="btn btn-success-gradient m-y-10 mr-10"
            >
              <i class="fas fa-plus mr-10"></i> Add Item
            </button>
          </div>
        </div>
        <div v-else class="row">
          <div class="col-lg-2">
            <img
              :src="user.image_url"
              :alt="`${user.first_name} ${user.last_name} Profile Picture`"
              class="circle"
            />
          </div>
          <div class="col-lg-7">
            <h1>{{ user.first_name }} {{ user.last_name }}</h1>
            <p>@{{ user.username }}</p>
          </div>
          <div class="col-lg-3 text-right">
            <button
              v-if="user.friends == true"
              class="btn btn-danger-gradient btn-xs mt-40"
            >
              <span class="fas fa-trash"></span
              ><span class="m-y-10">Remove Friend</span>
            </button>
            <button
              v-if="user.friends == false"
              class="btn btn-success-gradient mt-40"
              ><span class="fas fa-plus"></span
              ><span class="m-y-10">Add Friend</span></button
            ></div
          >
        </div>
      </div>
      <img
        src="/assets/images/angle-light.svg"
        class="img-bottom mt-100"
        alt=""
      />
    </header>
    <div class="main-container">
      <section id="signup" class="md">
        <div class="container">
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
          <div v-if="$parent.isCurrentUser()">
            <!-- Create Item Form -->
            <div v-if="showForm">
              <h2>Add an Item</h2>
              <form v-on:submit.prevent="createItem()">
                <label for="">Name: </label
                ><input type="text" v-model="newName" />
                <label for="">Image URL: </label>
                <input type="text" v-model="newImage" />
                <label for="">Category: </label>
                <select name="" id="" v-model="newCategory">
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

          <!-- Items -->
          <div class="items" v-if="user.items && user.items.length > 0">
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
                filterBy(user.items, searchCategory, 'category.id'),
                searchName,
                'name'
              )"
              :key="item.id"
              :class="{ unavailable: !item.available }"
            >
              <h3>{{ item.name }}</h3>
              <img :src="item.image_url" alt="" width="100" /><br />
              <p>{{ item.category.name }}</p>
              <button
                v-if="$parent.isCurrentUser()"
                v-on:click="openEditModal(item)"
              >
                Edit
              </button>
              <button
                v-if="$parent.isCurrentUser()"
                v-on:click="destroyItem(item)"
              >
                Delete
              </button>
              <button
                v-else-if="item.available"
                v-on:click="createBorrowRequest(item)"
              >
                Request to Borrow
              </button>
              <div v-if="!item.available && $parent.isCurrentUser()">
                <strong
                  >Currently borrowed by:
                  <router-link
                    :to="`/users/${item.borrow_request.user.username}`"
                    >{{ item.borrow_request.user.first_name }}
                    {{ item.borrow_request.user.last_name }}</router-link
                  ></strong
                >
                <img
                  :src="item.borrow_request.user.image_url"
                  alt=""
                  width="50"
                />
              </div>
            </div>
          </div>
          <p v-else>
            Looks like you don't have any items yet!<br />
            <button v-on:click="toggleForm()">Click here to get started</button>
          </p>

          <!-- Borrowed Items -->
          <div v-if="$parent.isCurrentUser() && user.borrowed_items.length > 0">
            <hr />
            <h2>Borrowed Items</h2>
            <div v-for="item in user.borrowed_items" :key="item.id">
              <h3>{{ item.name }}</h3>
              <img :src="item.image_url" alt="" width="100" /><br />
              <strong>Belongs to: </strong
              ><router-link :to="`/users/${item.user.username}`"
                >{{ item.user.first_name }}
                {{ item.user.last_name }}</router-link
              >
              <img :src="item.user.image_url" alt="" width="50" />
            </div> </div></div></section
    ></div>

    <!-- Edit Dialog -->
    <dialog>
      <form method="dialog">
        <h2>Edit Item</h2>
        <ul>
          <li class="text-danger" v-for="error in errors" v-bind:key="error">
            {{ error }}
          </li>
        </ul>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="form-control" v-model="currentItem.name" />
        </div>
        <div class="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            class="form-control"
            v-model="currentItem.image_url"
          />
        </div>
        <div class="form-group" v-if="currentItem">
          <label for="">Category: </label>
          <select name="" id="" v-model="currentItem.category.id">
            <option value="">Choose a Category</option>
            <option
              v-for="category in categories"
              :value="category.id"
              :key="category.id"
              >{{ category.name }}</option
            ></select
          >
        </div>
        <div class="form-group">
          <label for="">Status: </label>
          <span v-if="currentItem.borrow_request"
            >Currently borrowed by
            {{ currentItem.borrow_request.user.first_name }}
            {{ currentItem.borrow_request.user.last_name }}<br />
            <button
              v-on:click.prevent="
                updateBorrowRequest(currentItem.borrow_request.id)
              "
            >
              Mark as Returned
            </button></span
          >
          <span v-else>Available</span>
        </div>
        <hr />
        <button v-on:click.prevent="updateItem()">Update</button>
        <button>Close</button>
      </form>
    </dialog>
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
      user: "",
      categories: [],
      showForm: false,
      newName: "",
      newCategory: "",
      newImage: "",
      searchName: "",
      searchCategory: "",
      currentItem: "",
      errors: [],
      alert: ""
    };
  },
  created: function() {
    this.getUser();
    axios.get("/api/categories").then(response => {
      this.categories = response.data;
      // console.log(response.data);
    });
  },
  methods: {
    getUser: function() {
      axios.get(`/api/users/${this.$route.params.username}`).then(response => {
        this.user = response.data;
        console.log(response.data);
      });
    },
    toggleForm: function() {
      this.showForm = !this.showForm;
    },
    createItem: function() {
      var params = {
        name: this.newName,
        image_url: this.newImage,
        category_id: this.newCategory
      };
      axios.post("/api/items", params).then(response => {
        console.log(response.data);
        this.user.items.unshift(response.data);
        this.newName = "";
        this.newCategory = "";
        this.newImage = "";
      });
    },
    openEditModal: function(item) {
      this.currentItem = item;
      // console.log(this.currentItem);
      document.querySelector("dialog").showModal();
    },
    updateItem: function() {
      var params = {
        name: this.currentItem.name,
        image_url: this.currentItem.image_url,
        category_id: this.currentItem.category.id
      };
      axios
        .patch(`/api/items/${this.currentItem.id}`, params)
        .then(response => {
          console.log(response.data);
          document.querySelector("dialog").close();
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    destroyItem: function(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        axios
          .delete(`/api/items/${item.id}`)
          .then(response => {
            console.log(response.data);
            var index = this.user.items.indexOf(item);
            this.user.items.splice(index, 1);
          })
          .catch(error => {
            this.errors = error.response.data.errors;
          });
      }
    },
    createBorrowRequest: function(item) {
      axios
        .post("/api/borrow-requests", { item_id: item.id })
        .then(response => {
          console.log(response.data);
          this.alert = "Borrow request sent!";
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    updateBorrowRequest: function() {
      axios
        .patch(`/api/borrow-requests/${this.currentItem.borrow_request.id}`, {
          status: "returned"
        })
        .then(response => {
          console.log(response.data);
          document.querySelector("dialog").close();
          var index = this.user.items.indexOf(this.currentItem);
          this.user.items[index].available = true;
          delete this.user.items[index].borrow_request;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
