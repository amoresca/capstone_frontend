<template>
  <div class="items-index">
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <h1>Borrow</h1>
        <h5 class="mb-30">
          Take a look at your friends' items and request to borrow&nbsp;them
        </h5>
      </div>
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-100" alt="" />
    </header>
    <div class="main-container" v-if="items">
      <section id="borrow" class="md">
        <div class="container">
          <!-- Alert -->
          <div
            class="alert alert-success alert-dismissible fade show"
            role="alert"
            v-if="alert"
          >
            <span class="far fa-check-square fs-22 mr-15"></span>
            <strong>{{ alert }}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div v-if="items.length > 0">
            <!-- Search -->
            <div class="form-group d-md-flex mb-50 promo-box">
              <label for="search-items" class="col-form-label mr-20">
                <h4 style="white-space: nowrap">Search Items</h4>
              </label>
              <input
                type="text"
                id="search-items"
                placeholder="Search by name or tag..."
                v-model="searchName"
                class="form-control mr-20 mb-3 mb-md-0"
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

            <div class="row">
              <div
                v-for="item in filterBy(
                  filterBy(items, searchCategory, 'category.id'),
                  searchName,
                  'name',
                  'tags'
                )"
                :key="item.id"
                class="col-md-6 mb-30"
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
                    <p class="card-title"
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
          <div v-else class="text-center">
            <h4 class="mt-80 mb-30">Nothing to see here... Try adding some friends!</h4>
            <router-link to="/friends"
              ><button class="btn btn-outline-success mb-80"
                >Add Friend</button
              ></router-link
            >
          </div>

          <!--- Modal --->
          <div
            class="modal fade default-modal"
            id="current-item"
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
                        ><img
                          :src="currentItem.image_url"
                          :alt="currentItem.name"
                          width="200"
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
                  <button
                    class="btn btn-sm btn-info"
                    v-if="currentItem.available"
                    v-on:click.prevent="createBorrowRequest(currentItem)"
                  >
                    Request to Borrow
                  </button>
                  <button
                    class="btn btn-sm btn-info"
                    v-else
                    v-on:click.prevent="createWaitlistRequest(currentItem)"
                    >Add Me to Waitlist</button
                  ></div
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
      $("#current-item").modal("show");
    },
    createBorrowRequest: function(item) {
      axios
        .post("/api/borrow-requests", { item_id: item.id })
        .then(response => {
          console.log(response.data);
          this.alert = "Borrow request sent!";
          $("#current-item").modal("hide");
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
          $("#current-item").modal("hide");
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>
