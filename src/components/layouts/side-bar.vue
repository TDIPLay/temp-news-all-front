<template>
  <!-- ========== Left Sidebar Start ========== -->
  <div class="vertical-menu">
    <SimpleBar
      v-if="!isCondensed"
      :settings="settings"
      class="h-100"
      ref="currentMenu"
      id="my-element"
    >
      <SideNav />
    </SimpleBar>

    <SimpleBar v-else class="h-100">
      <SideNav />
    </SimpleBar>
  </div>
  <!-- Left Sidebar End -->
</template>

<script setup lang="ts">
import { SimpleBar } from "simplebar-vue3";
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SideNav from "./side-nav.vue";
const route = useRoute();
const props = defineProps({
  isCondensed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    required: true,
  },
});
const isSimplebar = ref(null);
const settings = reactive({
  minScrollbarLength: 60,
});
const onRoutechange = () => {
  setTimeout(() => {
    if (document.getElementsByClassName("mm-active").length > 0) {
      const currentPosition = (
        document.getElementsByClassName("mm-active")[0] as HTMLElement
      ).offsetTop;
      // if (currentPosition > 500)
      // if (isSimplebar.value){
      // (isSimplebar.value).getScrollElement().scrollTop =
      //     currentPosition + 300;
      //   }
    }
  }, 300);
};

// watch(() => route, onRoutechange);
watch(
  () => props.width,
  (newVal, oldVal) => {
    console.log("width:", newVal);
    if (newVal !== oldVal) {
      setWidthAttr(newVal);
    }
  }
);
watch(
  () => props.type,
  (newVal, oldVal) => {
    console.log("type:", newVal);
    if (newVal !== oldVal) {
      setTypeAttr(newVal);
    }
  }
);

const setTypeAttr = (type: string) => {
  switch (type) {
    case "boxed":
      document.body.setAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-layout-scrollable");
      break;
    case "fluid":
      document.body.setAttribute("data-layout-mode", "fluid");
      document.body.removeAttribute("data-layout-size");
      document.body.removeAttribute("data-layout-scrollable");
      break;
    case "scrollable":
      document.body.setAttribute("data-layout-scrollable", "true");
      document.body.removeAttribute("data-layout-mode");
      document.body.removeAttribute("data-layout-size");
      break;
    default:
      document.body.setAttribute("data-layout-mode", "fluid");
      break;
  }
};

const setWidthAttr = (width: string) => {
  switch (width) {
    case "dark":
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-topbar");
      document.body.removeAttribute("data-sidebar-size");
      document.body.removeAttribute("data-keep-enlarged");
      document.body.classList.remove("vertical-collpsed");
      break;
    case "light":
      document.body.setAttribute("data-topbar", "dark");
      document.body.removeAttribute("data-sidebar");
      document.body.removeAttribute("data-sidebar-size");
      document.body.classList.remove("vertical-collpsed");
      break;
    case "compact":
      document.body.setAttribute("data-sidebar-size", "small");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.classList.remove("vertical-collpsed");
      document.body.removeAttribute("data-topbar");
      break;
    case "icon":
      document.body.setAttribute("data-keep-enlarged", "true");
      document.body.classList.add("vertical-collpsed");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-topbar");
      break;
    case "colored":
      document.body.setAttribute("data-sidebar", "colored");
      document.body.removeAttribute("data-keep-enlarged");
      document.body.classList.remove("vertical-collpsed");
      document.body.removeAttribute("data-sidebar-size");
      break;
    default:
      document.body.setAttribute("data-sidebar", "dark");
      break;
  }
};
setTypeAttr(props.type);
setWidthAttr(props.width);
</script>
