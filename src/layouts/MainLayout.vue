<template>
  <div style="position: relative">
    <VerticalLayout
      v-if="layoutType === 'vertical'"
      :layout="layoutType"
      @content-scroll="(event:Event) => emit('content-scroll', event)"
    >
      <slot />
    </VerticalLayout>

    <HorizontalLayout
      v-if="layoutType === 'horizontal'"
      :layout="layoutType"
      @content-scroll="(event:Event) =>emit('content-scroll', event)"
    >
      <slot />
    </HorizontalLayout>
  </div>
</template>

<script setup lang="ts">
import { useHelperStore } from "@/store/helper";
import VerticalLayout from "@/layouts/VerticalLayout.vue";
import HorizontalLayout from "@/layouts/HorizontalLayout.vue";
import { onBeforeMount } from "vue";
import { useSessionStore } from "@/store/session";

const { setUserInfo } = useSessionStore();

const emit = defineEmits<{
  (e: "content-scroll'", value?: any): void;
}>();
const { layoutType } = useHelperStore();

onBeforeMount(() => {
  const userId = localStorage.getItem("user") ?? "";
  const userName = localStorage.getItem("user_name") ?? "";
  const accountType = localStorage.getItem("user_account_type") ?? "";

  setUserInfo({
    id: userId ? JSON.parse(userId) : "",
    name: userName ? JSON.parse(userName) : "",
    type: accountType ? JSON.parse(accountType) : "",
  });
});
</script>
