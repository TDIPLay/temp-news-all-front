import { CommonUtils } from "src/utils/CommonUtils";

export class ApiResultVo {
  public resultCode = "S0000"; // S0000 S로 시작하면 성공, E로 시작하면 실패
  public message = "";
  public total = -1;
  public data: any = null;
  public isError = false;
  public page = 0;
  public params = {};

  constructor(res: any) {
    CommonUtils.updateVOCamel(this, res, false);
    if (!res) return;

    // E로 시작하는 응답코드는 모두 에러임
    this.isError = this.resultCode.indexOf("E") === 0;

    if (this.isError) return;
  }
}
