import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import LogoutView from "@/views/LogoutView.vue";
import RoundsView from "@/views/RoundsView.vue";
import RoundView from "@/views/RoundView.vue";

const routes: Readonly<RouteRecordRaw[]> = [
  { path: "/logout", component: LogoutView },
  { path: "/rounds", component: RoundsView },
  { path: "/rounds/:id", component: RoundView, props: true },
  { path: "/:pathMatch(.*)*", redirect: "/rounds" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
