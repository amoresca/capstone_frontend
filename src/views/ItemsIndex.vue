<template>
  <div class="items-index">
    <header class="pt-200 pb-0 bg-primary dark">
      <div class="container">
        <h1>Borrow</h1>
        <h5 class="mb-30">
          Take a look at your friends' items and request to borrow them
        </h5>
      </div>
      <img src="/assets/images/angle-light.svg" class="img-bottom mt-100" alt="" />
    </header>
    <div class="main-container" v-if="items">
      <section id="borrow" class="md">
        <div class="container">
          <!-- Alert -->
          <div
            class="alert alert-warning alert-dismissible fade show"
            role="alert"
            v-if="alert"
          >
            <strong>{{ alert }}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div v-if="items.length > 0">
            <!-- Search -->
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

            <div class="row">
              <div
                v-for="item in filterBy(
                  filterBy(items, searchCategory, 'category.id'),
                  searchName,
                  'name',
                  'tags'
                )"
                :key="item.id"
                class="col-lg-6"
              >
                <div :class="{ 'bg-light-grey': !item.available }" class="promo-box p-20">
                  <div class="d-flex">
                    <div class="col pl-0 pr-5" style="max-width: 100px;">
                      <div class="item-thumbnail rounded">
                        <a href="#" v-on:click.prevent="openShowModal(item)">
                          <img :src="item.image_url" :alt="item.name" />
                        </a>
                      </div>
                    </div>
                    <div class="col">
                      <p class="card-title"
                        ><a
                          href="#"
                          class="stretched-link fs-16"
                          v-on:click.prevent="openShowModal(item)"
                          >{{ item.name }}</a
                        ></p
                      >
                      <p class="mb-0">Category: {{ item.category.name }}</p>
                      <img
                        :src="item.user.image_url"
                        :alt="
                          `${item.user.first_name} ${item.user.last_name} Profile Picture`
                        "
                        class="circle float-right"
                        style="width:50px;"
                      />
                      <p>
                        <span v-for="tag in item.tags" :key="tag.id"
                          >#{{ tag.name }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
          </dialog></div
        ></section
      ></div
    >
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
