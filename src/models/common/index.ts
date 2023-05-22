import { CommonUtils } from "src/utils/CommonUtils";
import _ from "lodash";
export const DaysOptions = [
  {
    value: 0,
    name: "일",
  },
  {
    value: 1,
    name: "월",
  },
  {
    value: 2,
    name: "화",
  },
  {
    value: 3,
    name: "수",
  },
  {
    value: 4,
    name: "목",
  },
  {
    value: 5,
    name: "금",
  },
  {
    value: 6,
    name: "토",
  },
];
/**@description:  활성 상태  */
export const StatusOptions = [
  {
    value: "0",
    name: "비활성",
    color: "red",
  },
  {
    value: "1",
    name: "활성",
    color: "green",
  },
];
/**@description:  사용 상태  */
export const UseStatusOptions = [
  {
    value: "0",
    name: "미사용",
    color: "red",
  },
  {
    value: "1",
    name: "사용",
    color: "green",
  },
];
/**@description:  소재 유형 */
export const CreativeTypeOptions = [
  {
    value: "1",
    name: "영상",
    color: "primary",
  },
  {
    value: "2",
    name: "이미지",
    color: "secondary",
  },
];
/**@description:  소재 상태 */
export const CreativeStatusOptions = [
  {
    value: "0",
    name: "미완료",
    color: "orange",
  },
  {
    value: "1",
    name: "완료",
    color: "green",
  },
  {
    value: "2",
    name: "불허",
    color: "red",
  },
];
/**@description:  캠페인 진행 상태  */
export const CampaignStatusOptions = [
  {
    value: "0",
    name: "예약",
    color: "orange",
  },
  {
    value: "1",
    name: "진행",
    color: "green",
  },
  {
    value: "2",
    name: "중지",
    color: "red",
  },
  {
    value: "3",
    name: "종료",
    color: "dark",
  },
  {
    value: "4",
    name: "취소",
    color: "grey",
  },
];

/**@description:  사간 타겟  */
export const TimeTargetOptions = [
  {
    name: "00 ~ 01",
    value: 1,
  },
  {
    name: "00 ~ 01",
    value: 2,
  },
  {
    name: "01 ~ 02",
    value: 4,
  },
  {
    name: "02 ~ 03",
    value: 8,
  },
  {
    name: "03 ~ 04",
    value: 16,
  },
  {
    name: "04 ~ 05",
    value: 32,
  },
  {
    name: "05 ~ 06",
    value: 64,
  },
  {
    name: "06 ~ 07",
    value: 128,
  },
  {
    name: "07 ~ 08",
    value: 256,
  },
  {
    name: "08 ~ 09",
    value: 512,
  },
  {
    name: "09 ~ 10",
    value: 1024,
  },
  {
    name: "10 ~ 11",
    value: 2048,
  },
  {
    name: "11 ~ 12",
    value: 4096,
  },
  {
    name: "12 ~ 13",
    value: 8192,
  },
  {
    name: "13 ~ 14",
    value: 16384,
  },
  {
    name: "14 ~ 15",
    value: 32768,
  },
  {
    name: "15 ~ 16",
    value: 65536,
  },
  {
    name: "17 ~ 18",
    value: 131072,
  },
  {
    name: "18 ~ 19",
    value: 262144,
  },
  {
    name: "19 ~ 20",
    value: 524288,
  },
  {
    name: "20 ~ 21",
    value: 1048576,
  },
  {
    name: "21 ~ 22",
    value: 2097152,
  },
  {
    name: "22 ~ 23",
    value: 4194304,
  },
  {
    name: "23 ~ 24",
    value: 8388608,
  },
];
/**@description:  사간 타겟  */
export const DayTargetOptions = [
  {
    name: "일요일",
    value: 1,
  },
  {
    name: "월요일",
    value: 2,
  },
  {
    name: "화요일",
    value: 4,
  },
  {
    name: "수요일",
    value: 8,
  },
  {
    name: "목요일",
    value: 16,
  },
  {
    name: "금요일",
    value: 32,
  },
  {
    name: "토요일",
    value: 64,
  },
];
export enum CommonFilter {
  dateRange = "dateRange",
  advertiser = "advertiser",
  media = "media",
  branch = "branch",
  authStatus = "authStatus",
  agency = "agency",
  category = "category",
  keyword = "keyword",
}

export enum CommonFilterLabel {
  dateRange = "기간",
  advertiser = "광고주",
  media = "매체사",
  authStatus = "상태",
  branch = "지점",
  agency = "대행사",
  category = "카테고리",
  keyword = "검색어",
}

interface filterItem {
  allSelected?: boolean;
  type: CommonFilter;
}
export class CommonFilterPositionItem {
  label? = "";
  items: filterItem[] = [];

  constructor(init?: Partial<CommonFilterPositionItem>) {
    if (init) {
      CommonUtils.updateVoByKey(this, init);
    }

    if (_.isEmpty(this.label)) {
      this.label = "";
      this.items.forEach((item, idx) => {
        this.label += CommonFilterLabel[item.type];
        if (this.items.length > 1 && this.items.length - 1 > idx)
          this.label += " 및 ";
      });
    }
  }
}
export class CommonFilterItem {
  // disabledScope = CommonFilter.advertiser;
  // disabledAuthLevel: AuthLevel = AuthLevel.MANAGER;
  // autoSelect: CommonFilter[] = [];
  // position: CommonFilterPositionItem[] = [];

  disabledScope = null;
  // disabledAuthLevel: AuthLevel = AuthLevel.MANAGER;
  autoSelect: CommonFilter[] = [];
  position: CommonFilterPositionItem[] = [];

  constructor(init?: Partial<CommonFilterItem>) {
    if (init) {
      CommonUtils.updateVoByKey(this, init);
    }

    this.position = this.position.map((item) => {
      return new CommonFilterPositionItem(item);
    });
  }

  checkAllSelected = (prop: CommonFilter): boolean => {
    let result = false;
    this.position.map((position) => {
      position.items.map((item) => {
        if (item.type === prop && item.allSelected) result = true;
      });
    });
    return result;
  };

  hasFilterItem = (prop: string): boolean => {
    let result = false;
    this.position.map((position) => {
      position.items.map((item) => {
        if (item.type === prop) result = true;
      });
    });
    return result;
  };
}
