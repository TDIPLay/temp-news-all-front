import { CommonUtils } from "@/utils/CommonUtils";

export interface DialogOption {
  okLabel?: string;
  cancelLabel?: string;
  imagePath?: string;
  width?: string;
  persistent?: boolean;
  icon?: string;
}

export enum DialogType {
  ALERT = "alert",
  ERROR = "error",
  INFO = "info",
  PROMPT = "prompt",
}

export enum DialogActionType {
  OK = "ok",
  CANCEL = "cancel",
}

export class DialogForm {
  static readonly WIDTH_SMALL: number = 385;
  static readonly WIDTH_MEDIUM: number = 442; // defalt size
  static readonly WIDTH_LARGE: number = 500;
  static readonly WIDTH_AUTO: string = "auto";

  static readonly TYPE_ALERT: string = "alert";
  static readonly TYPE_PROMPT: string = "prompt";

  title = "";
  message = "";
  okCallback: any;
  cancelCallback: any;
  type = "";
  data: any = null;
  okLabel = "확인";
  cancelLabel = "취소";
  showBtn = true;
  id = "";

  width = "500px";
  persistent = true; // 버튼을 눌러야만 닫히도록 할때 = true, modal영역을 눌러도 닫히도록 할때 = false
  imagePath: string | null = null; // 팝업에서 아이콘을 사용하는데 이미지를 사용하는 경우 이미지의 경로
  icon: string | null = null; // 팝업 타이틀에 아이콘을 사용하는데 웹폰트를 사용하는 경우 webfont의 이름
  style = {
    width: "80%",
    maxWidth: "385px",
  };
  constructor(init?: any) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    if (this.type === DialogType.ALERT && !init.okLabel) {
      this.okLabel = "확인";
    } else {
      this.okLabel = init.okLabel || "확인";
    }
    if (init.okCallback) {
      this.okCallback = init.okCallback;
    }
    if (init.cancelCallback) {
      this.cancelCallback = init.cancelCallback;
    }
    // this.icon =
    //   this.type === DialogType.INFO
    //     ? 'mdi-information-outline'
    //     : this.type === DialogType.ERROR
    //     ? 'mdi-close-circle-outline'
    //     : '';
  }
}
