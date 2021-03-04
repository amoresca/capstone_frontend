<template>
  <div class="users-show">
    <img :src="user.image_url" alt="" width="50" />
    <h1>{{ user.first_name }} {{ user.last_name }}</h1>
    <h3>@{{ user.username }}</h3>
    <button v-if="user.friends == true">Remove Friend</button>
    <button v-if="user.friends == false">Add Friend</button>

    <hr />

    <div class="items">
      <div v-for="item in user.items" :key="item.id">
        {{ item }}
        <h3>{{ item.name }}</h3>
        <img :src="item.image_url" alt="" width="100" />
      </div>
    </div>
  </div>
</template>

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
