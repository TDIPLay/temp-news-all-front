<template>
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner-chase">
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
          <div class="chase-dot"></div>
        </div>
      </div>
    </div>
    <div id="layout-wrapper">
      <NavBar
        @toggle-menu="toggleMenu"
        @toggle-right-sidebar="toggleRightSidebar"
      />
      <SideBar
        :is-condensed="isMenuCondensed"
        :type="leftSidebarType"
        :width="layoutWidth"
      />
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->

      <div
        class="main-content"
        @scroll="(event:Event) => emit('content-scroll', event)"
      >
        <div class="page-content">
          <!-- Start Content-->
          <b-container fluid>
            <slot />
          </b-container>
        </div>
        <FootLayout />
      </div>
      <!-- 테마는 잠시 보류 -->
      <!-- <RightBar
        @toggle-right-sidebar="toggleRightSidebar"
        @hide-right-sidebar="hideRightSidebar"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHelperStore } from "@/store/helper";

import NavBar from "@/components/layouts/nav-bar.vue";
import SideBar from "@/components/layouts/side-bar.vue";
// import RightBar from "@/components/layouts/right-bar.vue";
import FootLayout from "@/components/layouts/footer-layout.vue";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits<{
  (e: "content-scroll'", value?: any): void;
}>();

const { leftSidebarType, layoutWidth, loader } = useHelperStore();
const router = useRouter();

const type = ref(leftSidebarType.value ?? null);
const width = ref(layoutWidth.value ?? null);
const isMenuCondensed = ref(false);

onBeforeMount(() => {
  document.body.removeAttribute("data-layout");
  document.body.removeAttribute("data-topbar");
  document.body.removeAttribute("data-layout-size");
  document.body.classList.remove("auth-body-bg");
});

const toggleMenu = () => {
  document.body.classList.toggle("sidebar-enable");

  if (window.screen.width >= 992) {
    // eslint-disable-next-line no-unused-vars
    router.afterEach((routeTo, routeFrom) => {
      document.body.classList.remove("sidebar-enable");
      document.body.classList.remove("vertical-collpsed");
    });
    document.body.classList.toggle("vertical-collpsed");
  } else {
    // eslint-disable-next-line no-unused-vars
    router.afterEach((routeTo, routeFrom) => {
      document.body.classList.remove("sidebar-enable");
    });
    document.body.classList.remove("vertical-collpsed");
  }
  isMenuCondensed.value = !isMenuCondensed.value;
};
const toggleRightSidebar = () => {
  document.body.classList.toggle("right-bar-enabled");
};
const hideRightSidebar = () => {
  document.body.classList.remove("right-bar-enabled");
};

onMounted(() => {
  const preloaderEl = document.getElementById("preloader");
  const statusEl = document.getElementById("status");

  if (loader.value === true) {
    if (preloaderEl) preloaderEl.style.display = "block";
    if (statusEl) statusEl.style.display = "block";

    setTimeout(function () {
      if (preloaderEl) preloaderEl.style.display = "none";
      if (statusEl) statusEl.style.display = "none";
    }, 2500);
  } else {
    if (preloaderEl) preloaderEl.style.display = "none";
    if (statusEl) statusEl.style.display = "none";
  }
});
</script>
