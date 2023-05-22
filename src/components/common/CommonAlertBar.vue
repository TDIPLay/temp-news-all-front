<template>
  <!-- default -->
  <article v-if="defult" :class="{ default: snackbar }">
    <div class="left_box">
      <span>
        <i class="bx bx-info-circle font-size-20"></i>
      </span>
      <p v-html="text" />
    </div>
    <div @click="close">
      <i class="bx bx-x-circle font-size-20"></i>
    </div>
  </article>

  <!-- err -->

  <article v-else :class="{ error: snackbar }">
    <div class="left_box">
      <span>
        <i class="bx bx-info-circle font-size-20"></i>
      </span>
      <p v-html="text" />
    </div>
    <div @click="close">
      <i class="bx bx-x-circle font-size-20"></i>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { useCommonStore } from "@/store/common";
import { computed } from "@vue/reactivity";

const { notiMsg, closeNoti } = useCommonStore();

const text = computed(() => {
  return notiMsg?.msg.replace(/\\n | \n | \r/g, "<br/>") || "";
});
const snackbar = computed(() => {
  return notiMsg?.active || false;
});
const defult = computed(() => {
  return notiMsg?.type ? notiMsg?.type !== "error" : true;
});

const close = () => {
  closeNoti();
};
</script>
<style lang="css" scoped>
article {
  position: fixed;
  z-index: 999999;
  left: 50%;
  top: -90px;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px 20px;
  width: calc(100% - 72px);
  max-width: 336px;
  height: auto;
  min-height: 52px;
  color: white;
  box-sizing: border-box;
  transform: translateX(-50%);
  justify-content: space-between;
  transition: all 0.3s ease-in-out;
  display: flex !important;
  opacity: 0;
}
article .left_box {
  display: flex;
  align-items: center;
}
article .left_box span {
  margin-right: 8px;
}

article p {
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-bottom: 0;
}
article.default {
  background-color: rgb(17, 17, 17, 0.8);
  top: 40px;
  opacity: 1;
}
article.error {
  background-color: rgb(229, 31, 54, 0.8);
  top: 40px;
  opacity: 1;
}
</style>
