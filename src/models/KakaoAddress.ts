import { CommonUtils } from "@/utils/CommonUtils";

export class KakaoAddress {
  address = "";
  postcode = "";
  detailAddress = "";
  extraAddress = "";

  constructor(init?: any) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);
  }
}
