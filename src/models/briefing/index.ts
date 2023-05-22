import { CommonUtils } from "@/utils/CommonUtils";
import moment from "moment";
import { NewListItem } from "@/models/scrap";

export const BriefingStatusOptions = [
  {
    value: "1",
    label: "미발행",
    color: "#FFC107",
  },
  {
    value: "2",
    label: "발행",
    color: "#FFC107",
  },
];

export interface BriefingNewListOb {
  news_list: NewListItem[];
  group_no: string;
  group_name: string;
}

export class Briefing {
  division = "regist";
  briefing_key = "";
  preview_link = "";
  briefing_no = "";
  attached_file = null;
  attached_file_name = "";
  file = null;
  status = "";

  briefing_title = ""; // 제목
  briefing_content = ""; // 에디터 내용

  reporter = ""; // 작성자
  reported_date = moment().format("YYYY-MM-DD");

  briefing_footer_content = ""; // 에디터2번 하단 내용
  briefing_news_list: BriefingNewListOb[] = []; // 선택한 뉴스 그룹
  reg_date = "";

  origin: any = null;

  constructor(init?: any, skipOrigin = false) {
    this.reporter = localStorage.getItem("user_name")
      ? JSON.parse(localStorage.getItem("user_name") ?? "")
      : "";
    this.briefing_title = `새로운 브리핑_${moment().format("YYYYMMDDHHmm")}`;
    if (!init) return;
    CommonUtils.updateVoByData(this, init);

    this.division = init.briefing_no ? "read" : "regist";

    if (!this.briefing_news_list) {
      this.briefing_news_list = [];
    }
    if (typeof this.briefing_news_list == "string") {
      const tempStr = (this.briefing_news_list as string)
        // .replace(/\&quot;/g, '"')
        // .replace(/\&quot;/g, '"')
        // .replace(/"/g, `'`)
        // .replace(/\r/gi, "\\r")
        // .replace(/\n/gi, "\\n")
        // .replace(/\t/gi, "\\t")
        // .replace(/\f/gi, "\\f")
        .replace(/\&quot;/g, `\"`);
      this.briefing_news_list = JSON.parse(tempStr);
    }

    // console.log(this.briefing_no, this.briefing_news_list);
    if (this.briefing_news_list && this.briefing_news_list.length > 0) {
      this.briefing_news_list = this.briefing_news_list.map((item) => {
        const temp = item.news_list.map((news) => new NewListItem(news));
        return {
          ...item,
          briefing_news_list: temp,
        };
      });
    }
    if (this.briefing_key) {
      this.preview_link = `${window.location.protocol}//${window.location.host}/preview-briefing?key=${this.briefing_key}`;
    }
    if (!skipOrigin) {
      this.origin = new Briefing(this, true);
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

  get badge_color() {
    const status = Number(this.status);
    let color = "#FFC107";
    switch (status) {
      case 1: // 1: 신청
        color = "#FFC107";
        break;
      case 2: // 2:신청서 검토
        color = "#FFEB3B";
        break;
      case 3: // 3:접수 완료
        color = "#1976D2";
        break;
      case 4: // 4:배포 진행
        color = "#9C27B0";
        break;
      case 5: // 4:배포완료
        color = "#4CAF50";
        break;
      default:
        // 에러
        color = "#db3700";
    }
    return color;
  }

  // 하위 데이터 업데이트 여부
  isUpdate(): boolean {
    if (!this.origin) return false;
    return true;
    // return (
    //   JSON.stringify({
    //     briefing_no: this.briefing_no,
    //     file: this.file,
    //     news_title: this.news_title,
    //     news_content: this.news_content,
    //   }) !==
    //   JSON.stringify({
    //     briefing_no: this.origin.briefing_no,
    //     file: this.origin.file,
    //     news_title: this.origin.news_title,
    //     news_content: this.origin.news_content,
    //   })
    // );
  }

  vaild() {
    let res = "";
    if (!this.briefing_no) {
      res = [
        // "file",
        "briefing_title",
        "briefing_content",
        "reporter",
        "reported_date",
      ].reduce((acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      }, "");
    } else {
      res = [
        "briefing_title",
        "briefing_content",
        "reporter",
        "reported_date",
      ].reduce((acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      }, "");
    }

    return res;
  }

  /**
   * @description: 등록 or 수정 or 삭제할 데이터
   */
  saveDataFormat() {
    const updateKeys = [
      "briefing_title",
      "briefing_content",
      "briefing_news_list",
      "reporter",
      "reported_date",
    ];
    const temp: any = {};

    updateKeys.forEach((key) => {
      const newVal = (this as any)[key];
      temp[key] = newVal;
    });

    if (temp.upload_division && this.file) {
      temp.attached_file = this.file;
    }

    if (temp.briefing_news_list) {
      temp.briefing_news_list = this.briefing_news_list.map((group) => {
        const temps = group.news_list
          ? group.news_list.map((item) => ({
              description: item.description,
              keyword: item.keyword,
              keyword_no: item.keyword_no,
              news_title: item.news_title,
              news_no: item.news_no,
              original_link: item.original_link,
              press_name: item.press_name,
              pub_date: item.pub_date,
            }))
          : [];

        return {
          ...group,
          news_list: temps,
        };
      });
      temp.briefing_news_list = JSON.stringify(temp.briefing_news_list);
    }
    if (this.briefing_no) {
      temp["briefing_no"] = this.briefing_no;
    }

    return Object.keys(temp).length > 0 ? temp : null;
  }
}
