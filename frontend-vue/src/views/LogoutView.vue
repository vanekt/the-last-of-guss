<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/mutations/auth";
import { RouteNames } from "@/constants";

const router = useRouter();
const logoutMutation = useLogoutMutation(() =>
  router.replace({ name: RouteNames.Rounds }),
);

onMounted(() => {
  logoutMutation.mutate();
});
</script>
