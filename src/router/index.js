import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import MyAccount from "../views/MyAccount.vue";
import UsersShow from "../views/UsersShow.vue";
import FriendshipsIndex from "../views/FriendshipsIndex.vue";
import Requests from "../views/Requests.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/signup", name: "signup", component: Signup },
  { path: "/login", name: "login", component: Login },
  { path: "/logout", name: "logout", component: Logout },
  { path: "/my-account", name: "my-account", component: MyAccount },
  { path: "/users/:username", name: "users-show", component: UsersShow },
  { path: "/friends", name: "friendships-index", component: FriendshipsIndex },
  { path: "/requests", name: "requests", component: Requests },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
