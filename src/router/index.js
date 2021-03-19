import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import MyAccount from "../views/MyAccount.vue";
import UsersShow from "../views/UsersShow.vue";
import FriendshipsIndex from "../views/FriendshipsIndex.vue";
import ItemsIndex from "../views/ItemsIndex.vue";
import Requests from "../views/Requests.vue";
import RequestsChannel from "../views/RequestsChannel.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: {
      title: "Signup"
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Login"
    }
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout
  },
  {
    path: "/my-account",
    name: "my-account",
    component: MyAccount,
    meta: {
      title: "My Account"
    }
  },
  { path: "/users/:username", name: "users-show", component: UsersShow },
  {
    path: "/friends",
    name: "friendships-index",
    component: FriendshipsIndex,
    meta: {
      title: "Friends"
    }
  },
  {
    path: "/items",
    name: "items-index",
    component: ItemsIndex,
    meta: {
      title: "Borrow"
    }
  },
  {
    path: "/requests",
    name: "requests",
    component: Requests,
    meta: {
      title: "Requests"
    }
  },
  {
    path: "/requests-channel",
    name: "requests-channel",
    component: RequestsChannel
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// This callback runs before every route change, including on page load.
// router.beforeEach((to, from, next) => {
//   // This goes through the matched routes from last to first, finding the closest route with a title.
//   // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
//   // `/nested`'s will be chosen.
//   const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

//   // Find the nearest route element with meta tags.
//   const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

//   // If a route with a title was found, set the document (page) title to that value.
//   if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

//   // Remove any stale meta tags from the document using the key attribute we set below.
//   Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

//   // Skip rendering meta tags if there are none.
//   if(!nearestWithMeta) return next();

//   // Turn the meta tag definitions into actual elements in the head.
//   nearestWithMeta.meta.metaTags.map(tagDef => {
//     const tag = document.createElement('meta');

//     Object.keys(tagDef).forEach(key => {
//       tag.setAttribute(key, tagDef[key]);
//     });

//     // We use this to track which meta tags we create so we don't interfere with other ones.
//     tag.setAttribute('data-vue-router-controlled', '');

//     return tag;
//   })
//   // Add the meta tags to the document head.
//   .forEach(tag => document.head.appendChild(tag));

//   next();
// });

export default router;
