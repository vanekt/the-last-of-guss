import { createApp } from "vue";
import { router } from "./router";
import "./index.css";
import App from "./App.vue";

createApp(App).use(router).mount("#root");

window.BUILD_INFO = {
  branch: import.meta.env.VITE_BRANCH_NAME,
  buildTime: import.meta.env.VITE_BUILD_TIME,
  commitHash: import.meta.env.VITE_COMMIT_HASH,
  commitDate: import.meta.env.VITE_COMMIT_DATE,
};
