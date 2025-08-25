<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  authStore.resetToken();
  authStore.setUser(null);
  router.replace("/");
});
</script>
