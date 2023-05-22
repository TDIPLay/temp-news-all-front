import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import { DialogForm } from "@/models/common/DialogForm";
import { useRoute, useRouter } from "vue-router";

export interface showDialogProps {
  title?: string;
  message?: string;
  type?: string;
  okCallback?: () => void;
  cancelCallback?: () => void;
  option?: object;
}

export const useHelperStore = defineStore("helper", () => {
  /**@description: state */
  const layoutType = ref<string>("vertical");
  const leftSidebarType = ref<string>("dark");
  const layoutWidth = ref<string>("fluid");
  const topbar = ref<string>("dark");
  const loader = ref<boolean>(false);

  return {
    layoutType: computed(() => layoutType),
    leftSidebarType: computed(() => leftSidebarType),
    layoutWidth: computed(() => layoutWidth),
    topbar: computed(() => topbar),
    loader: computed(() => loader),
  };
});
