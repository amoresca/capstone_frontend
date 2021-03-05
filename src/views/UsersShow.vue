<template>
  <div class="users-show">
    <div v-if="$parent.isCurrentUser()">
      <h1>My Items</h1>
      <button>Add Item</button><br />
      <label for="">Search by name: </label><input type="text" />
      <label for="">Category: </label
      ><select name="" id="">
        <option value="">Test</option>
      </select>
    </div>
    <div v-else>
      <img :src="user.image_url" alt="" width="50" />
      <h1>{{ user.first_name }} {{ user.last_name }}</h1>
      <h3>@{{ user.username }}</h3>
      <button v-if="user.friends == true">Remove Friend</button>
      <button v-if="user.friends == false">Add Friend</button>
    </div>

    <hr />

    <div class="items">
      <div
        v-for="item in user.items"
        :key="item.id"
        :class="{ unavailable: !item.available }"
      >
        <!-- {{ item }} -->
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
        <!-- {{ item }} -->
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

export default {
  data: function() {
    return {
      user: {},
      errors: [],
    };
  },
  created: function() {
    axios.get(`/api/users/${this.$route.params.username}`).then(response => {
      this.user = response.data;
      // console.log(response.data);
    });
  },
  methods: {},
};
</script>
