<template>
  <div @click="hide()">
    <div @click.stop="() => {}" class="right-bar">
      <SimpleBar class="h-100">
        <div class="rightbar-title px-3 py-4 d-flex">
          <h5 class="m-0">Settings</h5>
          <a
            href="javascript:void(0);"
            class="right-bar-toggle ms-auto"
            @click="handleRightBarClick()"
          >
            <i class="mdi mdi-close noti-icon"></i>
          </a>
        </div>
        <hr class="mt-0" />
        <div class="p-3">
          <h6 class="mb-0">Layout</h6>
          <hr class="mt-1" />

          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="layout"
              id="layout-radio1"
              value="vertical"
              v-model="layout"
            />
            <label class="form-check-label" for="layout-radio1">Vertical</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="layout"
              id="layout-radio2"
              value="horizontal"
              v-model="layout"
            />
            <label class="form-check-label" for="layout-radio2"
              >Horizontal</label
            >
          </div>

          <!-- Width -->
          <h6 class="mt-3">Width</h6>
          <hr class="mt-1" />

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="widthradio"
              id="width-radio1"
              value="fluid"
              v-model="width"
            />
            <label class="form-check-label" for="width-radio1"> Fluid </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="widthradio"
              id="width-radio2"
              value="boxed"
              v-model="width"
            />
            <label class="form-check-label" for="width-radio2"> Boxed </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="widthradio"
              id="width-radio3"
              value="scrollable"
              v-model="width"
            />
            <label class="form-check-label" for="width-radio3">
              Scrollable
            </label>
          </div>

          <!-- Sidebar -->
          <div v-if="layout === 'vertical'">
            <h6 class="mt-3">Sidebar</h6>
            <hr class="mt-1" />
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sidebar-radio"
                id="sidebar-dark"
                value="dark"
                v-model="leftSidebarType"
              />
              <label class="form-check-label" for="sidebar-dark"> Dark </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sidebar-radio"
                id="sidebar-light"
                value="light"
                v-model="leftSidebarType"
              />
              <label class="form-check-label" for="sidebar-light">
                Light
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sidebar-radio"
                id="sidebar-compact"
                value="compact"
                v-model="leftSidebarType"
              />
              <label class="form-check-label" for="sidebar-compact">
                Compact
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sidebar-radio"
                id="sidebar-icon"
                value="icon"
                v-model="leftSidebarType"
              />
              <label class="form-check-label" for="sidebar-icon"> Icon </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sidebar-radio"
                id="sidebar-colored"
                value="colored"
                v-model="leftSidebarType"
              />
              <label class="form-check-label" for="sidebar-colored">
                Colored
              </label>
            </div>
          </div>

          <!-- Topbar -->
          <div v-if="layout === 'horizontal'">
            <h6 class="mt-3">Topbar</h6>
            <hr class="mt-1" />
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sidebar-radio"
                id="topbar-dark"
                value="dark"
                v-model="topbar"
              />
              <label class="form-check-label" for="topbar-dark"> Dark </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="topbar-radio"
                id="topbar-light"
                value="light"
                v-model="topbar"
              />
              <label class="form-check-label" for="topbar-light"> Light </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="topbar-radio"
                id="topbar-colored"
                value="colored"
                v-model="topbar"
              />
              <label class="form-check-label" for="topbar-colored">
                Colored
              </label>
            </div>
          </div>

          <!-- Preloader -->
          <h6 class="mt-3">Preloader</h6>
          <hr class="mt-1" />

          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="is-loader"
              v-model="loader"
            />
            <label class="form-check-label" for="is-loader">Preloader</label>
          </div>
        </div>
        <h6 class="text-center mb-0">Choose Mode</h6>
        <div class="p-4">
          <div class="mb-2">
            <router-link
              target="_blank"
              to="//skote.vuejs-light.themesbrand.com/"
            >
              <img
                src="@/assets/images/layouts/layout-1.jpg"
                class="img-fluid img-thumbnail"
                alt
              />
            </router-link>
          </div>

          <div class="mb-2">
            <router-link
              target="_blank"
              to="//skote.vuejs-dark.themesbrand.com/"
            >
              <img
                src="@/assets/images/layouts/layout-2.jpg"
                class="img-fluid img-thumbnail"
                alt
              />
            </router-link>
          </div>

          <div class="mb-2">
            <router-link
              target="_blank"
              to="//skote.vuejs-rtl.themesbrand.com/"
            >
              <img
                src="@/assets/images/layouts/layout-3.jpg"
                class="img-fluid img-thumbnail"
                alt
              />
            </router-link>
          </div>
        </div>
      </SimpleBar>
    </div>
    <!-- Right bar overlay-->
    <div class="rightbar-overlay"></div>
  </div>
</template>
<script setup lang="ts">
import { useHelperStore } from "@/store/helper";
import { SimpleBar } from "simplebar-vue3";
import { ref, computed, reactive } from "vue";

const { layoutType, leftSidebarType, layoutWidth, topbar, loader } =
  useHelperStore();

const emit = defineEmits<{
  (e: "toggle-right-sidebar", value?: any): void;
  (e: "hide-right-sidebar", value?: any): void;
}>();

const layout = computed({
  get: () => layoutType.value,
  set: (val) => (layoutType.value = val),
});

const width = computed({
  get: () => layoutWidth.value,
  set: (val: string) => {
    layoutWidth.value = val;

    if (val == "boxed") {
      leftSidebarType.value = "icon";
    } else if (val == "fluid" || val == "scrollable") {
      leftSidebarType.value = "dark";
    }
  },
});

const hide = () => {
  console.log("hide");
  emit("toggle-right-sidebar");
};

const handleRightBarClick = () => {
  emit("hide-right-sidebar");
};

const middleware = ({ target }: Event) => {
  if (!target) return;
  const targetEl = (target as HTMLElement).classList;
  if (targetEl) return !targetEl.contains("toggle-right");
};

const config = reactive({
  handler: handleRightBarClick(),
  middleware: middleware,
  events: ["click"],
});
</script>
