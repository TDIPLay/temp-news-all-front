import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";
import CKEditor from "@ckeditor/ckeditor5-vue";

//++++++++++++++ Template Add +++++++++++++++++++
import i18n from "./i18n";
import VueApexCharts from "vue3-apexcharts";
import { registerScrollSpy } from "vue3-scroll-spy";
import Maska from "maska";
import BootstrapVueNext from "bootstrap-vue-next";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

import "sweetalert2/dist/sweetalert2.min.css";
import "@vueform/slider/themes/default.css";

import "@/design/app.scss"; // light 버전

const pinia = createPinia();
const app = createApp(App);
// const vClickOutside = require("click-outside-vue3");

// app.config.globalProperties.$router = useRouter();
// app.config.globalProperties.$route = useRoute();

app
  .use(pinia)
  .use(router)
  .use(require("vue-chartist"))
  .use(BootstrapVueNext)
  .use(VueApexCharts)
  // .use(vClickOutside)
  .use(registerScrollSpy)
  .use(i18n)
  .use(Maska)
  .use(CKEditor)
  .mount("#app");
