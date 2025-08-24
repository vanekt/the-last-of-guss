import { createRouter, createWebHistory } from "vue-router";

import LogoutPage from "./pages/LogoutPage.vue";
import RoundsPage from "./pages/RoundsPage.vue";
import RoundPage from "./pages/RoundPage.vue";

const routes = [
  { path: "/logout", component: LogoutPage },
  { path: "/rounds", component: RoundsPage },
  { path: "/rounds/:id", component: RoundPage },
  { path: "/:pathMatch(.*)*", redirect: "/rounds" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
