import { CommonUtils } from "@/utils/CommonUtils";
import moment from "moment";
export const DistributeNewsStatusOptions = [
  {
    value: "1",
    label: "신청",
    color: "#FFC107",
  },
  {
    value: "2",
    label: "신청서 검토",
    color: "#FFC107",
  },
  {
    value: "3",
    label: "접수 완료",
    color: "#FFC107",
  },
  {
    value: "4",
    label: "배포 진행",
    color: "#FFC107",
  },
  {
    value: "5",
    label: "배포완료",
    color: "#FFC107",
  },
];
export class DistributeNews {
  division = "regist";

  dis_no = "";
  attached_file = null;
  attached_file_name = "";
  file = null;
  status = 1;
  news_title = "";
  news_content = "";
  user_name = "";
  company_name = "";
  position_name = "";
  phone_number = "";
  email = "";
  homepage = "";
  reg_date = "";

  origin: any = null;

  constructor(init?: any, skipOrigin = false) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    this.division = init.dis_no ? "read" : "regist";

    const numberFormatKeys = ["creative_play_time"];
    numberFormatKeys.forEach((key) => {
      const val = (this as any)[`${key}`];

      if (val) {
        (this as any)[`${key}_format`] = Number(val) / 1000;
      }
    });

    if (!skipOrigin) {
      this.origin = new DistributeNews(this, true);
    }
  }

  /**@description:  등록시에는 1 고정, 수정시에는 변경 하면 1 아니면 0  */
  get upload_division() {
    return this.division === "regist" ? 1 : this.file ? 1 : 0;
  }
  // set upload_division() {}

  get reg_date_format() {
    return moment(this.reg_date).format("YYYY-MM-DD");
  }
  get status_text() {
    const status = Number(this.status);
    let color = "신청";
    switch (status) {
      case 1: // 1: 신청
        color = "신청";
        break;
      case 2: // 2:신청서 검토
        color = "신청서 검토";
        break;
      case 3: // 3:접수 완료
        color = "접수 완료";
        break;
      case 4: // 4:배포 진행
        color = "배포 진행";
        break;
      case 5: // 4:배포완료
        color = "배포 완료";
        break;
      default:
        // 에러
        color = "";
    }
    return color;
  }

  get badge_color() {
    const status = Number(this.status);
    let color = "255, 191, 0"; // "#ffbf00";
    switch (status) {
      case 1: // 1: 신청
        color = "255, 193, 7"; // "#FFC107";
        break;
      case 2: // 2:신청서 검토
        color = "46, 184, 46"; // "#2eb82e";
        break;
      case 3: // 3:접수 완료
        color = "25, 118, 210"; // "#1976D2";
        break;
      case 4: // 4:배포 진행
        color = "156, 39, 176"; //"#9C27B0";
        break;
      case 5: // 4:배포완료
        color = "76, 175, 80"; // "#4CAF50";
        break;
      default:
        // 에러
        color = "219, 55, 0"; //"#db3700";
    }
    return color;
  }

  // 하위 데이터 업데이트 여부
  isUpdate(): boolean {
    if (!this.origin) return false;

    return (
      JSON.stringify({
        dis_no: this.dis_no,
        file: this.file,
        news_title: this.news_title,
        news_content: this.news_content,
      }) !==
      JSON.stringify({
        dis_no: this.origin.dis_no,
        file: this.origin.file,
        news_title: this.origin.news_title,
        news_content: this.origin.news_content,
      })
    );
  }

  vaild() {
    let res = "";
    if (!this.dis_no) {
      res = [
        "file",
        "news_title",
        "news_content",
        "user_name",
        "company_name",
        "position_name",
        "phone_number",
        "email",
        "homepage",
      ].reduce((acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      }, "");
    } else {
      res = [
        "news_title",
        "news_content",
        "user_name",
        "company_name",
        "position_name",
        "phone_number",
        "email",
        "homepage",
      ].reduce((acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      }, "");
    }

    if (!res && this.email) {
      const regex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!regex.test(this.email)) {
        res = "이메일 형식에 맞게 작성해 주세요.";
      }
    }
    if (!res && this.homepage) {
      const regex =
        // eslint-disable-next-line no-useless-escape
        /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      if (!regex.test(this.homepage)) {
        res = "홈패이지 주소를 형식에 맞게 작성해 주세요.";
      }
    }

    return res;
  }

  /**
   * @description: 등록 or 수정 or 삭제할 데이터
   */
  saveDataFormat() {
    const updateKeys = [
      "file",
      "news_title",
      "news_content",
      "user_name",
      "company_name",
      "position_name",
      "phone_number",
      "email",
      "homepage",
      "upload_division",
    ];
    const temp: any = {};

    updateKeys.forEach((key) => {
      const newVal = (this as any)[key];
      temp[key] = newVal;
    });

    if (temp.upload_division) {
      temp.attached_file = this.file;
    }
    if (this.dis_no) {
      temp["dis_no"] = this.dis_no;
    }

    return Object.keys(temp).length > 0 ? temp : null;
  }
}
