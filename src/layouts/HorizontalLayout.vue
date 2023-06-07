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
    <!-- Begin page -->
    <div id="layout-wrapper">
      <HorizontalTopbar
        :type="topbar"
        :width="layoutWidth"
        @toggle-right-sidebar="toggleRightSidebar"
      />
      <HorizontalNav />
      <!-- ============================================================== -->
      <!-- Start right Content here -->
      <!-- ============================================================== -->
      <div class="main-content">
        <div class="page-content">
          <b-container
            fluid
            @scroll="(event:Event) => emit('content-scroll', event)"
          >
            <slot />
          </b-container>
          <!-- container-fluid -->
        </div>
        <!-- End Page-content -->
        <FootLayout />
      </div>
      <!-- end main content-->
    </div>
    <!-- END layout-wrapper -->
    <!-- 테마는 잠시 보류 -->
    <RightBar
      @toggle-right-sidebar="toggleRightSidebar"
      @hide-right-sidebar="hideRightSidebar"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeMount } from "vue";

import HorizontalTopbar from "@/components/layouts/horizontal-topbar.vue";
import HorizontalNav from "@/components/layouts/horizontal-nav.vue";
// import RightBar from "@/components/layouts/right-bar.vue";
import FootLayout from "@/components/layouts/footer-layout.vue";

import { useHelperStore } from "@/store/helper";

const emit = defineEmits<{
  (e: "content-scroll'", value?: any): void;
}>();
const { loader, topbar } = useHelperStore();
onBeforeMount(() => {
  document.body.setAttribute("data-layout", "horizontal");
  document.body.setAttribute("data-topbar", "dark");
  document.body.removeAttribute("data-sidebar");
  document.body.removeAttribute("data-layout-size");
  document.body.classList.remove("auth-body-bg");
});

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
