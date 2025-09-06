import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { RouteNames } from "./constants";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: RouteNames.Rounds,
    component: () => import("@/views/RoundsView.vue"),
  },
  {
    path: "/round/:id",
    name: RouteNames.Round,
    component: () => import("@/views/RoundView.vue"),
    props: true,
  },
  {
    path: "/logout",
    name: RouteNames.Logout,
    component: () => import("@/views/LogoutView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.NotFound,
    redirect: { name: RouteNames.Rounds },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
