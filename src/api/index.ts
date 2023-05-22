import axios from "axios";

import { setInterceptors } from "./interceptors";

function createAxiosService() {
  const axiosService = axios.create({
    baseURL: `http://${window.location.host}/api`,
    // baseURL: process.env.VUE_APP_URL + "/api",
    // baseURL: process.env.VUE_APP_URL + "/api",
  });

  axiosService.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  axiosService.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axiosService.defaults.headers.common["Content-Type"] = "application/json";

  return setInterceptors(axiosService);
}

export const axiosService = createAxiosService();
