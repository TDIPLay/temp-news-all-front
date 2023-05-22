import _ from "lodash";
import axios from "axios";
export interface OptionItemProps {
  id: string;
  name: string;
}
export interface showDialogProps {
  title?: string;
  message?: string;
  type?: string;
  okCallback?: () => void;
  cancelCallback?: () => void;
  option?: object;
}

export class CommonUtils {
  /**
   * @description 특정 VO를 넘겨진 data의 값으로 업데이트 할때 쓰임
   * @param vo {Object} 업데이트 할 VO
   * @param data {Object} 업데이트 값을 가지고 있는 데이터
   * */
  public static updateVOCamel(vo: any, data: any, toCamelCase = true): void {
    if (!data) return;
    for (const key in data) {
      let voKey = key;
      if (toCamelCase) {
        // data가 xxx_xx 와 같은 형식으로 오는 경우 카멜케이스로 변경
        voKey = _.camelCase(key);
      }
      if (Object.prototype.hasOwnProperty.call(vo, voKey)) {
        vo[voKey] = data[key];
      }
    }
  }

  /**
   * @description : 특정 VO기준으로 넘겨진 data의 값으로 업데이트 할때 쓰임
   * */
  public static updateVoByKey(vo: any, data: any): void {
    if (!data) return;
    for (const key in vo) {
      if (_.has(data, key)) {
        vo[key] = data[key];
      }
    }
  }

  /**
   * @description : 넘겨받은 data기준으로 vo에 data의 값으로 업데이트 할때 쓰임
   * */
  public static updateVoByData(vo: any, data: any): void {
    if (!data) return;
    for (const key in data) {
      vo[key] = data[key];
    }
  }

  // ObjectData key => snake case -> camel case
  public static getCamelKeys(ObjectData: any) {
    const newData: any = {};

    Object.keys(ObjectData).map((item) => {
      let res = item;
      const regex = /^[a-z][A-Za-z]*$/;
      let itemVal = ObjectData[item];

      if (itemVal && typeof itemVal === "object") {
        if (!Array.isArray(itemVal)) itemVal = this.getCamelKeys(itemVal);
      }
      const checkKey =
        item.charAt(0) === "_" ? item.substr(1, item.length - 1) : item;

      if (!regex.test(checkKey)) {
        // key가 snake_case인경우 camelCase로 변환
        if (/[_-]/.test(checkKey)) {
          res = this.convToCamel(checkKey);
        }
        // 초기화 obj에  변환한 key에 값 주입
        newData[`${res}`] = itemVal;
      } else {
        newData[`${res}`] = itemVal;
      }
      return res;
    });
    return newData;
  }
  // snake case -> camel case
  public static convToCamel(key: string): string {
    const beforeKey = key.toLowerCase();
    let afterKey = "";
    const beforeKeyArr = beforeKey.split("_");

    if (beforeKeyArr.length < 2) {
      return beforeKey;
    }

    for (let i = 0; i < beforeKeyArr.length; i++) {
      if (beforeKeyArr[i].length > 0) {
        if (i == 0) afterKey += beforeKeyArr[i].toLowerCase();
        else
          afterKey +=
            beforeKeyArr[i].toLowerCase().substr(0, 1).toUpperCase() +
            beforeKeyArr[i].substr(1, beforeKeyArr[i].length - 1);
      }
    }
    return afterKey;
  }

  /***
   * @description : 파일을 읽어서 ArrayBuffer 로 리턴
   * */
  public static async readFile(
    src: File | Blob,
    type: "text" | "binary" = "binary"
  ): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        resolve(reader.result);
      };
      if (type === "text") {
        reader.readAsText(src);
      } else {
        reader.readAsDataURL(src);
      }
    });
  }

  /***
   * @description 앞자리를 0으로 채움
   * @param value: 원본 숫자
   * @param count: 앞에 채울 0의 개수(없으을때 value가 10보다 작으면 한개만 채움, 10보다 크면 value 그대로 리턴)
   * */
  public static addZero(value: number, count?: number): string {
    let zeroStr = "";
    if (_.isNumber(count)) {
      for (let i = 0; i < count; i++) {
        zeroStr += "0";
      }
      return zeroStr + value;
    } else {
      if (value < 10) {
        return "0" + value;
      } else {
        return value + "";
      }
    }
  }

  /***
   * @description format에 맞게 현재 날짜를 리턴, addDay가 있으면 addDay만큼 더해진 날짜를 리턴
   * @param format: 날짜 포멧 (ex. yyyy-MM-dd)
   * @param count: 앞에 채울 0의 개수(없으을때 value가 10보다 작으면 한개만 채움, 10보다 크면 value 그대로 리턴)
   * */
  public static getYmd(format?: string, addDay?: number): string {
    const nowDate = new Date();
    const weekKorName = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    const weekEngName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekEngShortName = [
      "Sun",
      "Monitoring.vue",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];
    if (_.isNumber(addDay)) {
      nowDate.setDate(nowDate.getDate() + addDay);
    }
    if (format === undefined || format === "") {
      format = "yyyy-MM-dd";
    }
    const d = nowDate;
    return format.replace(
      /(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi,
      ($1: any) => {
        switch ($1) {
          case "yyyy":
            return d.getFullYear(); // 년 (4자리)
          case "yy":
            return this.addZero(d.getFullYear() % 1000); // 년 (2자리)
          case "MM":
            return this.addZero(d.getMonth() + 1); // 월 (2자리)
          case "dd":
            return this.addZero(d.getDate()); // 일 (2자리)
          case "KS":
            return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
          case "KL":
            return weekKorName[d.getDay()]; // 요일 (긴 한글)
          case "ES":
            return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
          case "EL":
            return weekEngName[d.getDay()]; // 요일 (긴 영어)
          case "HH":
            return this.addZero(d.getHours()); // 시간 (24시간 기준, 2자리)
          case "hh":
            return this.addZero(d.getHours() % 12 ? d.getHours() % 12 : 12); // 시간 (12시간 기준, 2자리)
          case "mm":
            return this.addZero(d.getMinutes()); // 분 (2자리)
          case "ss":
            return this.addZero(d.getSeconds()); // 초 (2자리)
          case "a/p":
            return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
          default:
            return $1;
        }
      }
    );
  }

  public static copyToClipboard(text: string): void {
    let msg = "클립보드에 복사를 실패하였습니다.";
    let type = "negative";
    const textArea = document.createElement("textarea");
    try {
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand("copy");

      if (successful) {
        msg = "클립보드에 복사되었습니다.";
        type = "info";
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (textArea.parentNode) textArea.parentNode.removeChild(textArea);
      // Notify.create({
      //   message: msg,
      //   type: type,
      //   position: 'top-right',
      //   closeBtn: true,
      // });
    }
  }

  public static convertNumberToString(n: string | number): string {
    const num = Number(n);
    return num > 9 ? "" + num : "0" + num;
  }
  /**
   * 앱 호출관련 로직 true / false 반환
   * @param {*} type 앱 호출 파마미터 값을 입력해주세요
   * @returns
   */
  public static AppUtility(type: string): boolean {
    try {
      window.webToAppEvent.postMessage(type);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /**
   * @param {*} type : visit 방문 / sign 가입 / deal 결제
   * @param {*} info : object 유저정보
   */
  public static async SetPCookie(type: string, info: any) {
    const URLSearch = new URLSearchParams(location.search);

    //쿠키 굽기!
    const token = URLSearch.get("ptoken");
    const amount = URLSearch.get("amount");
    const pay_id = URLSearch.get("pay_id");
    const active = await CommonUtils.getCookie("t_partnerToken");

    const params: any = {
      type: type,
    };
    switch (type) {
      // 방문 추적
      case "visit": {
        params.refererUrl = document.referrer; // document.referrer;
        params.ptoken = token;
        break;
      }
      case "sign": {
        params.ptoken = decodeURIComponent(
          CommonUtils.getCookieValue("t_partnerToken")
        );
        params.tingsearchUserId = info.me.id;
        params.tingsearchUserEmail = info.me.email;
        break;
      }
      case "deal": {
        const decodePath = decodeURIComponent(
          CommonUtils.getCookieValue("t_partnerToken")
        ); //토큰 가져와 디코드생성
        params.ptoken = decodePath;
        params.amount = Number(amount);
        params.tingsearchDealId = Number(pay_id);
        params.tingsearchUserId = info.me.id;
        params.tingsearchUserEmail = info.me.email;
        break;
      }
    }

    if (token !== null && active === false) {
      CommonUtils.SetCookie("t_partnerToken", encodeURI(token), 30);
      axios.post(process.env.VUE_APP_URL, params).catch((err) => {
        console.log(err.response.data.err);
      });
    }

    if (active === true && type !== "visit") {
      axios.post(process.env.VUE_APP_URL, params).catch((err) => {
        console.log(err.response.data.err);
      });
    }
  }

  /**
   *
   * @param {*} name : string 쿠키 이름
   * @param {*} value : string 쿠키 이름에 넣어줄 값
   * @param {*} expiredays : number 날짜 1일 = 1
   */
  public static SetCookie(name: string, value: string, expiredays: number) {
    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);

    document.cookie =
      name +
      "=" +
      escape(value) +
      "; path=/; expires=" +
      todayDate.toUTCString() +
      ";";
  }

  /**
   *
   * @param {*} cookieName : string 찾고싶은 cookeName을 입력
   * 쿠키 있음 : true
   * 쿠키 없음 : false
   */
  public static getCookie(cookieName: string) {
    const cookiedata = document.cookie;
    if (cookiedata.indexOf(cookieName) < 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   *
   * @param {*} cookieName : 얻고싶은 cookie 값
   * @returns cookieToken
   */
  public static getCookieValue(cookieName: string) {
    const cookiedata = document.cookie;

    return (
      cookiedata.match("(^|;)\\s*" + cookieName + "\\s*=\\s*([^;]+)")?.pop() ||
      ""
    );
  }
}
