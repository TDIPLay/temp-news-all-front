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

    if (this.group_no && Number(this.group_no) > 0) {
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
  nlp_score = 0;
  nlp_keyword: string[] = [];
  reply_sympathy = 0; // 공감
  reply_non_sympathy = 0; // 비공감

  comments = "";

  constructor(init?: any) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);
  }
  get replySympathyPer() {
    const tot = this.reply_sympathy + this.reply_non_sympathy;
    return tot ? Math.round((this.reply_sympathy / tot) * 100) : 0;
  }
  get replyNoneSympathyPer() {
    const tot = this.reply_sympathy + this.reply_non_sympathy;
    return tot ? Math.round((this.reply_non_sympathy / tot) * 100) : 0;
  }

  get scoreTypeCode() {
    return this.nlp_score > 0.5
      ? 1 // 긍정
      : this.nlp_score < -0.5
      ? -1 // 부정
      : 0;
  }
  get scoreTypeText() {
    return this.nlp_score > 0.5
      ? "긍정" // 긍정
      : this.nlp_score < -0.5
      ? "부정" // 부정
      : "중립";
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
