import Vue from "vue";

declare global {
  interface Window {
    webToAppEvent?: any;
    webToIosAppleLogin?: any;
    webToIosNaverLogin?: any;

    webToAppSelectNewUrl?: any;
  }
}

declare module "v-click-outside";
