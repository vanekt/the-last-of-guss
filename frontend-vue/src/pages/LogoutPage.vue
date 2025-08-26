<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/mutations/auth";

const router = useRouter();
const logoutMutation = useLogoutMutation(() => router.replace("/"));

onMounted(() => {
  logoutMutation.mutate();
});
</script>
