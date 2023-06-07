<template>
  <router-view />

  <CommonLoading v-if="loading && showLoader" />
  <CommonAlertBar />
</template>
<script setup lang="ts">
import CommonLoading from "@/components/common/CommonLoading.vue";
import CommonAlertBar from "@/components/common/CommonAlertBar.vue";

import { useCommonStore } from "@/store/common";
const { loading, showLoader } = useCommonStore();

// const { t } = i18n.useI18n({ useScope: "global" });
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
