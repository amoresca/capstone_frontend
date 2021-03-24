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
              class="btn btn-success-gradient raised-primary m-y-10 mr-10"
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
            <h6>@{{ user.username }}</h6>
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
              v-on:click="createFriendship(user.id)"
              class="btn btn-success-gradient mt-40"
              ><span class="fas fa-plus mr-10"></span
              ><span class="m-y-10">Add Friend</span></button
            ></div
          >
        </div>
      </div>
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-100" alt="" />
    </header>
    <div class="main-container">
      <section id="items" class="md">
        <div class="container">
          <!-- Alert -->
          <div
            class="alert alert-dismissible fade show"
            :class="`alert-${alertColor}`"
            role="alert"
            v-if="alert"
          >
            <strong>{{ alert }}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div v-if="$parent.isCurrentUser()">
            <!-- Create Item Form -->
            <div class="promo-box collapse" id="add-item">
              <h3 class="section-title text-center mb-30">Add an Item</h3>
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
                  <select id="new-category" class="custom-select" v-model="newCategory">
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
                  <button class="btn btn-sm btn-success-gradient mt-30"
                    ><i class="fas fa-plus mr-10"></i> Add Item</button
                  >
                </div>
              </form>
            </div>
          </div>

          <div v-if="user.items && user.items.length > 0">
            <!-- Search Items -->
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
              <select id="category-items" class="custom-select" v-model="searchCategory">
                <option value="">All Categories</option>
                <option
                  v-for="category in categories"
                  :value="category.id"
                  :key="category.id"
                  >{{ category.name }}</option
                >
              </select>
            </div>

            <!-- Items -->
            <div class="row">
              <div
                v-for="item in filterBy(
                  filterBy(user.items, searchCategory, 'category.id'),
                  searchName,
                  'name',
                  'tags'
                )"
                :key="item.id"
                class="col-lg-6 mb-30"
              >
                <div
                  :class="{ 'bg-light-grey': !item.available }"
                  class="promo-box d-flex p-15 mb-0"
                  style="height:100%;"
                >
                  <div class="col pl-0 pr-5" style="max-width: 100px;">
                    <div class="item-thumbnail rounded">
                      <a href="#" v-on:click.prevent="openShowModal(item)">
                        <img :src="item.image_url" :alt="item.name" />
                      </a>
                    </div>
                  </div>
                  <div class="col pr-0 d-flex flex-column">
                    <p class="card-title mt-5"
                      ><a
                        href="#"
                        class="stretched-link fs-16"
                        v-on:click.prevent="openShowModal(item)"
                        >{{ item.name }}</a
                      ></p
                    >
                    <p class="mb-0">Category: {{ item.category.name }}</p>
                    <p v-if="item.tags.length > 0">
                      <span v-for="tag in item.tags" :key="tag.id">#{{ tag.name }} </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="$parent.isCurrentUser()" class="text-center">
            <h4 class="mt-80 mb-30">Looks like you don't have any items yet!</h4>
            <button v-on:click="toggleForm()" class="btn btn-outline-success mb-80"
              >Click here to get started</button
            >
          </div>
          <h4 v-else-if="user.friends" class="m-y-80 text-center"
            >Looks like {{ user.first_name }} doesn't have any items yet...</h4
          >
          <h4 v-else class="m-y-80 text-center"
            >Add {{ user.first_name }} as a friend to see their items!</h4
          >

          <!-- Borrowed Items -->
          <div v-if="$parent.isCurrentUser() && user.borrowed_items.length > 0">
            <hr class="m-y-50" />
            <h2>Borrowed Items</h2>
            <h6 class="mb-20"
              >This is what you're currently borrowing from your friends.</h6
            >
            <div class="row">
              <div
                v-for="item in user.borrowed_items"
                :key="item.id"
                class="col-lg-6 mb-30"
              >
                <div class="promo-box d-flex p-15 mb-0" style="height:100%;">
                  <div class="col pl-0 pr-5" style="max-width: 100px;">
                    <div class="item-thumbnail rounded">
                      <img :src="item.image_url" :alt="item.name" />
                    </div>
                  </div>
                  <div class="col pr-0 d-flex flex-column">
                    <p class="card-title fs-16 mt-5">{{ item.name }}</p>
                    <p class="mb-0">Category: {{ item.category.name }}</p>
                    <p v-if="item.tags.length > 0">
                      <span v-for="tag in item.tags" :key="tag.id">#{{ tag.name }} </span>
                    </p>
                  </div>
                  <router-link
                    :to="`/users/${item.user.username}`"
                    :title="`${item.user.first_name} ${item.user.last_name}`"
                    class="mt-auto"
                    ><img
                      :src="item.user.image_url"
                      :alt="
                        `${item.user.first_name} ${item.user.last_name} Profile Picture`
                      "
                      class="circle"
                      style="width:50px;"
                  /></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!--- Show Modal --->
    <div
      class="modal fade default-modal"
      id="item-show"
      tabindex="-1"
      style="display: none;"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" v-if="currentItem">
          <div class="modal-header">
            <h6 class="modal-title">{{ currentItem.name }}</h6> </div
          ><!-- / modal-header -->
          <div class="modal-body">
            <div class="container full-width">
              <!-- <ul>
                <li class="text-danger" v-for="error in errors" v-bind:key="error">
                  {{ error }}
                </li>
              </ul> -->
              <div class="d-flex">
                <div class="mr-20" style="width:100px;"
                  ><img :src="currentItem.image_url" :alt="currentItem.name" width="200"
                /></div>
                <div
                  ><p><strong>Category:</strong> {{ currentItem.category.name }}</p>
                  <p v-if="currentItem.tags.length > 0"
                    ><strong>Tags: </strong>
                    <span v-for="tag in currentItem.tags" :key="tag.id"
                      >#{{ tag.name }}
                    </span>
                  </p>
                  <p
                    ><strong>Status: </strong
                    ><span v-if="currentItem.available">Available</span
                    ><span v-else>Unavailable</span></p
                  >
                  <div v-if="!currentItem.available && $parent.isCurrentUser()">
                    <hr />
                    <p
                      ><strong
                        >Currently borrowed by:
                        <router-link
                          :to="`/users/${currentItem.borrow_request.user.username}`"
                          >{{ currentItem.borrow_request.user.first_name }}
                          {{ currentItem.borrow_request.user.last_name }}</router-link
                        ></strong
                      ></p
                    >
                    <button
                      v-on:click.prevent="
                        updateBorrowRequest(currentItem.borrow_request.id)
                      "
                      class="btn btn-outline-primary m-y-10 btn-sm p-y-10 p-x-30"
                    >
                      Mark as Returned
                    </button>
                  </div>
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
              ><i class="fas fa-times mr-10"></i>Close</button
            >
            <button
              v-if="$parent.isCurrentUser()"
              v-on:click="openEditModal(currentItem)"
              class="btn btn-sm btn-success mr-10"
            >
              <i class="fas fa-pencil-alt mr-10"></i>Edit
            </button>
            <button
              v-if="$parent.isCurrentUser()"
              v-on:click="destroyItem(currentItem)"
              class="btn btn-sm btn-danger"
            >
              <i class="fas fa-trash mr-10"></i>
              Remove
            </button>
            <button
              class="btn btn-sm btn-info"
              v-else-if="currentItem.available"
              v-on:click="createBorrowRequest(currentItem)"
            >
              Request to Borrow
            </button>
            <button
              class="btn btn-sm btn-info"
              v-else
              v-on:click.prevent="createWaitlistRequest(currentItem)"
              >Add Me to the Waitlist</button
            ></div
          ><!-- / modal-footer --> </div
        ><!-- / modal-content --> </div
      ><!-- / modal-dialog -->
    </div>

    <!--- Edit Modal --->
    <div
      class="modal fade default-modal"
      id="item-edit"
      tabindex="-1"
      style="display: none;"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" v-if="currentItem">
          <div class="modal-header"> <h6 class="modal-title">Edit Item</h6> </div
          ><!-- / modal-header -->
          <div class="modal-body">
            <div class="container full-width">
              <ul>
                <li class="text-danger" v-for="error in errors" v-bind:key="error">
                  {{ error }}
                </li>
              </ul>
              <form>
                <div class="input-group">
                  <div class="input-group-prepend"
                    ><span class="input-group-text"
                      ><i class="fas fa-pen-nib text-primary"></i></span></div
                  ><input
                    type="text"
                    placeholder="Name"
                    class="form-control w-icon-left"
                    v-model="currentItem.name"
                /></div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"
                      ><i class="fas fa-image text-primary"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    class="form-control w-icon-left"
                    v-model="currentItem.image_url"
                  />
                </div>
                <div class="form-group" v-if="currentItem">
                  <select class="custom-select" v-model="currentItem.category.id">
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
                  <label class="ml-15 mr-20">Status: </label>
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
              </form>
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
            <button
              v-on:click.prevent="updateItem()"
              class="btn btn-sm btn-success mr-10"
            >
              Save
            </button> </div
          ><!-- / modal-footer --> </div
        ><!-- / modal-content --> </div
      ><!-- / modal-dialog -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue2Filters from "vue2-filters";
import Multiselect from "vue-multiselect";
/*global $*/

export default {
  mixins: [Vue2Filters.mixin],
  components: { Multiselect },
  data: function() {
    return {
      user: "",
      categories: [],
      tags: [],
      newName: "",
      newCategory: "",
      newImage: "",
      newTags: [],
      newItemMessage: "",
      searchName: "",
      searchCategory: "",
      currentItem: "",
      errors: [],
      alert: "",
      alertColor: "success"
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
        console.log(response.data);
      });
    },
    toggleForm: function() {
      $("#add-item").collapse("toggle");
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
    openShowModal: function(item) {
      this.currentItem = item;
      // console.log(this.currentItem);
      $("#item-show").modal("show");
    },
    openEditModal: function() {
      $("#item-show").modal("hide");
      $("#item-edit").modal("show");
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
          $("#item-edit").modal("hide");
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
            $("#item-show").modal("hide");
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
          $("#item-show").modal("hide");
          this.alert = "Borrow request sent!";
          this.alertColor = "success";
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
          $("#item-show").modal("hide");
          var index = this.user.items.indexOf(this.currentItem);
          this.user.items[index].available = true;
          delete this.user.items[index].borrow_request;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    createFriendship: function(userId) {
      axios
        .post("/api/friendships", { requestee_id: userId })
        .then(response => {
          console.log(response.data);
          this.alert = "Friend request sent!";
          this.alertColor = "success";
        })
        .catch(error => {
          console.log(error.response.data);
        });
    }
  }
};
</script>
