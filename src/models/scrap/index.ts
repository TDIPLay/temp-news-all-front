import { CommonUtils } from "@/utils/CommonUtils";
import moment from "moment";

export class ScrapKeyword {
  keyword_no = "";
  keyword = "";

  reg_date = "";
  account_no = "";

  constructor(init?: any) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);
  }
}

export class ScrapKeywordGroup {
  group_no = "";
  group_name = "";
  keyword_list: ScrapKeyword[] = [];
  keyword_no_list: string[] = [];

  division = "regist";

  constructor(init?: any) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    if (this.group_no) {
      this.division = "modify";
    }

    if (this.keyword_list) {
      this.keyword_list = this.keyword_list.map(
        (item) => new ScrapKeyword(item)
      );

      this.keyword_no_list = this.keyword_list.map((item) => item.keyword_no);
    }
  }
}

export class NewListItem {
  description = "";
  email = "";
  keyword = "";
  keyword_no = "";
  naver_link = "";
  news_no = "";
  news_title = "";
  original_link = "";
  press_name = "";
  press_no = "";
  pub_date = "";
  regist = null;
  repoter = "";
  save_status = 0;
  thumbnail = "";
  platform = 0; // 1: 뉴스. 2.카페 3. 블로그

  comments = "";

  constructor(init?: any) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);
  }

  get platform_text(): string {
    return !this.platform
      ? ""
      : this.platform == 1
      ? "뉴스"
      : this.platform == 2
      ? "카페"
      : this.platform == 3
      ? "블로그"
      : "기타";
  }

  get decode_keyword(): string {
    return decodeURIComponent(this.keyword);
  }

  get pub_date_format(): string {
    return this.pub_date ? moment(this.pub_date).format("YYYY-MM-DD") : "";
  }
}
