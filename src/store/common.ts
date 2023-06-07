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

export const useCommonStore = defineStore("common", () => {
  /**@description: state */
  const dialogs = ref<DialogForm[]>([]);
  const dialogCnt = computed(() => dialogs.value.length);
  const loading = ref<boolean>(false);
  const showLoader = ref<boolean>(true);
  const notiMsg = reactive({
    msg: "",
    active: false,
    type: "info",
  });

  const route = useRoute();
  const router = useRouter();

  /**@description: state */
  const showDialog = ({
    title = "안내",
    message = "",
    type = "alert",
    okCallback = undefined,
    cancelCallback = undefined,
    option = undefined,
  }: showDialogProps) => {
    const msgVO: DialogForm = new DialogForm({
      id: `dialog_${dialogCnt.value}+1`,
      title: title,
      message: message,
      okCallback: okCallback,
      cancelCallback: cancelCallback,
      type: type,
      option: option,
    });

    // dialogs.value.push(new DialogForm(param));
    dialogs.value = [msgVO];
    console.log("dddd", dialogs.value);
  };

  const closeDialog = (id?: string) => {
    if (!dialogCnt.value) return;

    if (!id) {
      dialogs.value.splice(0, 1);
      return;
    }

    const dIndex = dialogs.value.findIndex((item) => item.id === id);

    if (dIndex > -1) {
      dialogs.value.splice(dIndex, 1);
    }
  };

  const showLoading = (show_loader = true) => {
    loading.value = true;
    showLoader.value = show_loader;
  };
  const hideLoading = () => {
    loading.value = false;
    showLoader.value = true;
  };

  /**@description: state */
  const showNoti = ({ message = "", type = "alert" }) => {
    notiMsg.msg = message;
    notiMsg.type = type === "error" ? "error" : "info";
    notiMsg.active = true;

    setTimeout(() => {
      notiMsg.active = false;
    }, 2500);
  };

  const closeNoti = () => {
    notiMsg.active = false;
  };

  return {
    dialogCnt: computed(() => dialogCnt),
    dialogs: computed(() => dialogs),
    loading: computed(() => loading),
    showLoader: computed(() => showLoader),
    notiMsg,
    showDialog,
    closeDialog,
    showLoading,
    hideLoading,
    showNoti,
    closeNoti,
  };
});
