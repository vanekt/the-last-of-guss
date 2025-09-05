import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import LogoutView from "@/views/LogoutView.vue";
import RoundsView from "@/views/RoundsView.vue";
import RoundView from "@/views/RoundView.vue";
import { RouteNames } from "./constants";

const routes: Readonly<RouteRecordRaw[]> = [
  { path: "/logout", name: RouteNames.Logout, component: LogoutView },
  { path: "/rounds", name: RouteNames.Rounds, component: RoundsView },
  {
    path: "/rounds/:id",
    name: RouteNames.Round,
    component: RoundView,
    props: true,
  },
  { path: "/:pathMatch(.*)*", redirect: "/rounds" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
