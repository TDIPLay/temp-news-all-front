import { CommonUtils } from "@/utils/CommonUtils";

export interface UserMenu {
  name: string;
  link?: string;
  key: string;
  order: number;
  groupId?: string;
  mdi?: string;
  children?: UserMenu[];
}

export enum UserRole {
  sadmin = "sadmin",
  admin = "admin",
  advertiser = "advertiser",
  media = "media",
  partner = "partner",
}

export enum UserRoleText {
  sadmin = "최고 관리자",
  admin = "관리자",
  advertiser = "광고주",
  media = "매체사",
  partner = "파트너",
  cashnote = "캐시노트",
}

export enum UserStatusText {
  Y = "승인",
  N = "거절",
  W = "대기",
}

export enum StatusColor {
  Y = "green",
  N = "red",
  W = "orange",
}

export class UserAuthInfo {
  name = "";
  email = "";
  role: UserRole | null = null;
  token = "";
  refreshToken = "";

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export const IndexColors = [
  "#6096B4",
  "#E96479",
  "#678983",
  "#678983",
  "#FFB100",
];

export class RegisterUser {
  division = "regist";

  account_id = "";
  account_pw = "";
  account_pw_cf = "";
  account_company = "";
  phone_number = "";
  mailing = false;
  name = "";

  origin: any = null;

  constructor(init?: any, skipOrigin = false) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    if (!skipOrigin) {
      this.origin = new RegisterUser(this, true);
    }
  }

  vaild() {
    let res = "";

    res = [
      "account_id",
      "account_pw",
      "account_pw_cf",
      "account_company",
      "phone_number",
      "name",
    ].reduce((acc: any, cur) => {
      if (!acc && !(this as any)[cur]) {
        acc = "필수 입력항목을 입력해 주세요";
      }
      return acc;
    }, "");

    if (!res && this.account_id) {
      const regex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!regex.test(this.account_id)) {
        res = "이메일 형식에 맞게 작성해 주세요.";
      }
    }

    if (!res && this.account_pw !== this.account_pw_cf) {
      res = "비밀번호가 돌일하지 않습니다.";
    }

    return res;
  }

  /**
   * @description: 등록 or 수정 or 삭제할 데이터
   */
  saveDataFormat() {
    const updateKeys = [
      "division",
      "account_id",
      "name",
      "account_pw",
      "account_pw_cf",
      "account_company",
      "phone_number",
      "mailing",
    ];
    const temp: any = {};

    updateKeys.forEach((key) => {
      const newVal = (this as any)[key];
      temp[key] = newVal;
    });

    return Object.keys(temp).length > 0 ? temp : null;
  }
}

export class UserInfo {
  division = "modify";

  account_id = "";
  account_company = "";
  phone_number = "";
  mailing = false;
  name = "";

  origin: any = null;

  constructor(init?: any, skipOrigin = false) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    if (!skipOrigin) {
      this.origin = new RegisterUser(this, true);
    }
    this.mailing = this.mailing ? true : false;
  }

  vaild() {
    let res = "";

    res = ["account_company", "phone_number", "name"].reduce(
      (acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      },
      ""
    );

    if (!res && this.account_id) {
      const regex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!regex.test(this.account_id)) {
        res = "이메일 형식에 맞게 작성해 주세요.";
      }
    }

    return res;
  }
  /**
   * @description: 수정  데이터
   */
  saveDataFormat() {
    const updateKeys = [
      "division",
      "account_company",
      "phone_number",
      "mailing",
      "name",
    ];
    const temp: any = {};

    updateKeys.forEach((key) => {
      const newVal = (this as any)[key];
      temp[key] = newVal;
    });
    temp.mailing = temp.mailing ? true : false;

    return Object.keys(temp).length > 0 ? temp : null;
  }
}

export class KakaoAlarmInfo {
  division = "regist";
  alarm_type = "2";
  alarm_start_time = "07:00";
  alarm_end_time = "19:00";
  alarm_target = "";

  keyword_no: Array<string | number> = [];
  open_group_pannel = [];
  origin: any = null;

  constructor(init?: any, skipOrigin = false) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    if (this.alarm_start_time) {
      const temp = this.alarm_start_time.split(":");
      this.alarm_start_time = `${temp[0]}:${temp[1]}`;
    }
    if (this.alarm_end_time) {
      const temp = this.alarm_end_time.split(":");
      this.alarm_end_time = `${temp[0]}:${temp[1]}`;
    }
    this.origin = null;
    if (!skipOrigin) {
      this.origin = new KakaoAlarmInfo(this, true);
    }
  }

  vaild() {
    let res = "";

    res = ["alarm_end_time", "alarm_start_time", "alarm_target"].reduce(
      (acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      },
      ""
    );

    if (!res && !this.keyword_no.length) {
      res = "알림을 받으르 키워드 그룹을 선택해 주세요.";
    }

    return res;
  }

  isUpdate() {
    const updateKeys = [
      "alarm_end_time",
      "alarm_start_time",
      "alarm_target",
      "keyword_no",
    ];
    const a = this.origin
      ? updateKeys.reduce((acc, item) => {
          const newVal = JSON.stringify((this as any)[item]);
          const orgVal = JSON.stringify((this.origin as any)[item]);

          if (!acc && newVal !== orgVal) {
            acc = true;
          }
          return acc;
        }, false as any)
      : true;
    return a;
  }

  isUpdateKey() {
    const updateKeys = [
      "alarm_end_time",
      "alarm_start_time",
      "alarm_target",
      "keyword_no",
    ];

    return this.origin
      ? updateKeys.reduce((acc, item) => {
          const newVal = JSON.stringify((this as any)[item]);
          const orgVal = JSON.stringify((this.origin as any)[item]);
          if (newVal !== orgVal) {
            acc.push(item);
          }

          return Array.from(new Set(acc));
        }, [] as string[])
      : updateKeys;
  }

  /**
   * @description: 등록  데이터
   */
  saveDataFormat() {
    const updateKeys = [
      "division",
      "alarm_type",
      "alarm_end_time",
      "alarm_start_time",
      "alarm_target",
      "keyword_no",
    ];
    const temp: any = {};

    updateKeys.forEach((key) => {
      let tempKey = key;
      let newVal = (this as any)[key];

      if (key === "keyword_no") {
        tempKey = "user_keyword_no";
      }
      if (key === "alarm_target") {
        tempKey = "alarm_phone_number";
      }

      if (["alarm_end_time", "alarm_start_time"].includes(key)) {
        newVal = newVal ? `${newVal}:00` : "";
      }

      temp[tempKey] = newVal;
    });

    return Object.keys(temp).length > 0 ? temp : null;
  }
}
export class MailAlarmInfo {
  division = "regist";
  alarm_type = 1;

  alarm_start_time = "07:00";
  alarm_end_time = "19:00";
  alarm_target = "";

  open_group_pannel = [];
  keyword_no: Array<string | number> = [];
  origin: any = null;

  constructor(init?: any, skipOrigin = false) {
    if (!init) return;
    CommonUtils.updateVoByKey(this, init);

    if (this.alarm_start_time) {
      const temp = this.alarm_start_time.split(":");
      this.alarm_start_time = `${temp[0]}:${temp[1]}`;
    }
    if (this.alarm_end_time) {
      const temp = this.alarm_end_time.split(":");
      this.alarm_end_time = `${temp[0]}:${temp[1]}`;
    }

    if (!skipOrigin) {
      this.origin = new MailAlarmInfo(this, true);
    }
  }

  vaild() {
    let res = "";

    res = ["alarm_end_time", "alarm_start_time", "alarm_target"].reduce(
      (acc: any, cur) => {
        if (!acc && !(this as any)[cur]) {
          acc = "필수 입력항목을 입력해 주세요";
        }
        return acc;
      },
      ""
    );

    if (!res && this.alarm_target) {
      const regex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!regex.test(this.alarm_target)) {
        res = "이메일 형식에 맞게 작성해 주세요.";
      }
    }

    if (!res && !this.keyword_no.length) {
      res = "알림을 받으르 키워드 그룹을 선택해 주세요.";
    }

    return res;
  }

  isUpdate() {
    const updateKeys = [
      "alarm_end_time",
      "alarm_start_time",
      "alarm_target",
      "keyword_no",
    ];

    return this.origin
      ? updateKeys.reduce((acc, item) => {
          const newVal = JSON.stringify((this as any)[item]);
          const orgVal = JSON.stringify((this.origin as any)[item]);
          if (!acc && newVal !== orgVal) {
            acc = true;
          }
          return acc;
        }, false as any)
      : true;
  }

  isUpdateKey() {
    const updateKeys = [
      "alarm_end_time",
      "alarm_start_time",
      "alarm_target",
      "keyword_no",
    ];

    return this.origin
      ? updateKeys.reduce((acc, item) => {
          const newVal = JSON.stringify((this as any)[item]);
          const orgVal = JSON.stringify((this.origin as any)[item]);
          if (newVal !== orgVal) {
            acc.push(item);
          }

          return Array.from(new Set(acc));
        }, [] as string[])
      : updateKeys;
  }

  /**
   * @description: 등록  데이터
   */
  saveDataFormat() {
    const updateKeys = [
      "division",
      "alarm_type",
      "alarm_end_time",
      "alarm_start_time",
      "alarm_target",
      "keyword_no",
    ];
    const temp: any = {};

    updateKeys.forEach((key) => {
      let tempKey = key;
      let newVal = (this as any)[key];

      if (key === "keyword_no") {
        tempKey = "user_keyword_no";
      }
      if (key === "alarm_target") {
        tempKey = "alarm_mail";
      }

      if (["alarm_end_time", "alarm_start_time"].includes(key)) {
        newVal = newVal ? `${newVal}:00` : "";
      }

      temp[tempKey] = newVal;
    });

    return Object.keys(temp).length > 0 ? temp : null;
  }
}
