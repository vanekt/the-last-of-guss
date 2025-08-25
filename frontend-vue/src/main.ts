import { createApp } from "vue";
import { router } from "./router";
import { store } from "./core/store";
import App from "./App.vue";
import "./index.css";

createApp(App).use(store).use(router).mount("#root");

window.BUILD_INFO = {
  branch: import.meta.env.VITE_BRANCH_NAME,
  buildTime: import.meta.env.VITE_BUILD_TIME,
  commitHash: import.meta.env.VITE_COMMIT_HASH,
  commitDate: import.meta.env.VITE_COMMIT_DATE,
};
