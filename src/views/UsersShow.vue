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
              <span class="fas fa-trash mr-10"></span
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
            <div v-if="showForm" class="promo-box">
              <h2>Add an Item</h2>
              <div
                v-if="newItemMessage"
                class="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <button
                  type="button"
                  class="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true" class="fas fa-times fs-16"></span>
                </button>
                <span class="far fa-check-square fs-22 mr-15"></span>
                <span><strong>Great!</strong> {{ newItemMessage }}</span>
              </div>
              <form v-on:submit.prevent="createItem()" class="row">
                <div class="col-lg-6">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"
                        ><i class="fas fa-pen-nib text-primary"></i
                      ></span> </div
                    ><!--/ input-group-prepend -->
                    <input
                      type="text"
                      class="form-control w-icon-left"
                      id="new-name"
                      placeholder="Name"
                      v-model="newName"
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"
                        ><i class="fas fa-image text-primary"></i
                      ></span> </div
                    ><!--/ input-group-prepend -->
                    <input
                      type="text"
                      class="form-control w-icon-left"
                      id="new-image"
                      placeholder="Image URL"
                      v-model="newImage"
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <select
                    id="new-category"
                    class="custom-select"
                    v-model="newCategory"
                  >
                    <option value="">Choose a Category</option>
                    <option
                      v-for="category in categories"
                      :value="category.id"
                      :key="category.id"
                      >{{ category.name }}</option
                    ></select
                  >
                </div>
                <div class="col-lg-6">
                  <multiselect
                    v-model="newTags"
                    tag-placeholder="Add this as new tag"
                    placeholder="Search or add a tag"
                    label="name"
                    track-by="id"
                    :options="tags"
                    :multiple="true"
                    :taggable="true"
                    @tag="addTag"
                  ></multiselect>
                </div>
                <div class="col">
                  <button>Add Item</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Items -->
          <div class="items" v-if="user.items && user.items.length > 0">
            <div class="form-group d-flex mb-50 promo-box">
              <label for="search-items" class="col-form-label mr-20">
                <h4 style="white-space: nowrap">Search Items</h4>
              </label>
              <input
                type="text"
                id="search-items"
                placeholder="Search by name or tag..."
                v-model="searchName"
                class="form-control mr-20"
              />
              <label for="category-items">
                <span class="sr-only">Category:</span>
              </label>
              <select
                id="category-items"
                class="custom-select"
                v-model="searchCategory"
              >
                <option value="">All Categories</option>
                <option
                  v-for="category in categories"
                  :value="category.id"
                  :key="category.id"
                  >{{ category.name }}</option
                >
              </select>
            </div>

            <div class="row">
              <div
                v-for="item in filterBy(
                  filterBy(user.items, searchCategory, 'category.id'),
                  searchName,
                  'name',
                  'tags'
                )"
                :key="item.id"
                :class="{ unavailable: !item.available }"
                class="col-lg-6"
              >
                <div class="promo-box">
                  <div class="row">
                    <div class="col-4">
                      <img :src="item.image_url" alt="" width="100" />
                    </div>
                    <div class="col-8">
                      <p class="card-title fs-16">{{ item.name }}</p>
                      <p class="mb-0">Category: {{ item.category.name }}</p>
                      <p
                        ><span v-for="tag in item.tags" :key="tag.id"
                          >#{{ tag.name }} </span
                        ><a
                          href="#"
                          v-if="
                            $parent.isCurrentUser() && item.tags.length === 0
                          "
                          v-on:click.prevent="openEditModal(item)"
                          >Click to add tags</a
                        ></p
                      >
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
                    </div>
                  </div>

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
              <img :src="item.image_url" alt="" width="100" />
              <p class="mb-0">Category: {{ item.category.name }}</p>
              <p
                ><span v-for="tag in item.tags" :key="tag.id"
                  >#{{ tag.name }}
                </span></p
              >
              <strong>Belongs to: </strong
              ><router-link :to="`/users/${item.user.username}`"
                >{{ item.user.first_name }}
                {{ item.user.last_name }}</router-link
              >
              <img :src="item.user.image_url" alt="" width="50" />
            </div>
          </div>
        </div>
      </section>
    </div>

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
          <multiselect
            v-model="currentItem.tags"
            tag-placeholder="Add this as new tag"
            placeholder="Search or add a tag"
            label="name"
            track-by="id"
            :options="tags"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          ></multiselect>
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
import Multiselect from "vue-multiselect";

export default {
  mixins: [Vue2Filters.mixin],
  components: { Multiselect },
  data: function() {
    return {
      user: "",
      categories: [],
      tags: [],
      showForm: false,
      newName: "",
      newCategory: "",
      newImage: "",
      newTags: [],
      newItemMessage: "",
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
    });
    axios.get("/api/tags").then(response => {
      this.tags = response.data;
    });
  },
  methods: {
    getUser: function() {
      axios.get(`/api/users/${this.$route.params.username}`).then(response => {
        this.user = response.data;
        // console.log(response.data);
      });
    },
    toggleForm: function() {
      this.showForm = !this.showForm;
    },
    addTag(newTagName) {
      // Create a new tag in the database
      axios
        .post("/api/tags", { name: newTagName })
        .then(response => {
          console.log(response.data);
          const tag = {
            id: response.data.id,
            name: newTagName
          };
          // Add new tag to options
          this.tags.push(tag);
          // Add new tag to new item
          this.newTags.push(tag);
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    createItem: function() {
      var params = {
        name: this.newName,
        image_url: this.newImage,
        category_id: this.newCategory,
        tag_ids: this.newTags.map(tag => tag.id)
      };
      axios.post("/api/items", params).then(response => {
        console.log(response.data);
        this.user.items.unshift(response.data);
        this.newItemMessage = `${this.newName} has been added to your items.`;
        // NOTE: Need to programatically trigger the alert
        this.newName = "";
        this.newCategory = "";
        this.newImage = "";
        this.newTags = "";
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
        category_id: this.currentItem.category.id,
        tag_ids: this.currentItem.tags.map(tag => tag.id)
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
