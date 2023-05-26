<template>
  <div class="home">
    <MainLayout @content-scroll="infiniteScrolling" :footer-hide="true">
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-18"> </span>
            </div>
          </div>
        </template>
      </PageHeader>

      <div class="row m-0 mt-4 text-start justify-content-center">
        <div class="col-auto">
          <img
            src="@/assets/images/logo/metavey_logo.png"
            class="mb-3 mb-md-10"
          />

          <h3 class="text-h5 font-weight-bold mt-5 mb-3">메타베이란?</h3>
          <p class="text-subtitle-1">
            메타베이는 세계 최초로 페이지 이동 없이 <br />
            뉴스 화면 안에서 이뤄지는 서베이 플랫폼 입니다.
          </p>
          <h3 class="text-h5 font-weight-bold mt-5 mb-3">
            설문 조사, 이제 메타베이와 함께 <br />
            뉴스에서 시작해 보십시오.
          </h3>
          <p class="text-subtitle-1">
            자세한 내용은 아래의 소개서 및 설문 요청을 누르셔서<br />
            메타베이 홈페이지를 참고해 주세요.
          </p>
        </div>
        <div class="col self-center d-flex jutify-content-sm-center">
          <img
            src="@/assets/images/logo/metavey_main.png"
            style="min-width: 420px; width: 100%; max-width: 700px"
          />
        </div>
      </div>
      <div
        class="row m-0 my-2 px-2 p-md-10 justify-content-center justify-content-md-start"
      >
        <div class="col-auto">
          <a
            color="#4e4f5a"
            style="width: 180px"
            class="btn btn-secondary event-btn mr-3"
            href="/file/METAVEY_Service.pdf"
            download
          >
            <span> 소개서 다운로드 </span>
          </a>
        </div>
        <div class="col-auto">
          <button
            style="width: 180px; backgronnd-color: #6366f1"
            class="btn btn-primary event-btn"
            @click="openNewPage"
          >
            <i class="mdi mdi-chevron-right"></i>
            <span> 설문 의뢰하기</span>
          </button>
        </div>
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import moment from "moment";

import PageHeader from "@/components/layouts/page-header.vue";
import SearchBarCustom from "@/components/search/SearchBarCustom.vue";
import NewsCardItem from "@/components/monitoring/CardItem.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import DatePicker from "vue3-datepicker";

import { useCommonStore } from "@/store/common";
import { OptionItemProps } from "@/utils/CommonUtils";

import { KeywordAPI } from "@/api/keyword";
import { ModulesAPI } from "@/api/module";

interface IFilterObj {
  in_keyword: string[];
  not_keyword: string[];
  in_press_no: number[];
  not_press_no: number[];
  start_date: string;
  end_date: string;
}

const { loading, showLoading, hideLoading, showNoti } = useCommonStore();
const showFilterList = reactive({
  keyword: true,
  press_no: true,
}); // 필터 펼침 여부
const pressList = ref<OptionItemProps[]>([]);
const searchPress = ref<any[]>([]); //언론사 필터
const searchKeyword = ref<any[]>([]); //언론사 필터
const newsList = ref<any[]>([]);
const keywordTypeList = [
  {
    value: "include",
    key: "in",
  },
  {
    value: "exclude",
    key: "not",
  },
];
const keywordType = ref("include");
const processKeywordType = ref("include");
const showMenu = reactive({
  start_date: false,
  end_date: false,
});
const filterObj = reactive<IFilterObj>({
  in_keyword: [],
  not_keyword: [],
  in_press_no: [],
  not_press_no: [],
  start_date: moment().subtract(7, "d").format("YYYY-MM-DD"),
  end_date: moment().format("YYYY-MM-DD"),
});
const tempData = reactive({
  start_date: new Date(filterObj.start_date),
  end_date: new Date(filterObj.end_date),
});
const pagenation = reactive({
  current: 1,
  limit: 100,
  isMax: false,
});
const timeLoading = ref(false);

/**@description: 검색 필터 초기화 */
const initFilter = () => {
  filterObj.in_keyword =
    filterObj.not_keyword =
    filterObj.in_press_no =
    filterObj.not_press_no =
      [];
  filterObj.start_date = moment().subtract(7, "d").format("YYYY-MM-DD");
  filterObj.end_date = moment().format("YYYY-MM-DD");
  tempData.start_date = new Date(filterObj.start_date);
  tempData.end_date = new Date(filterObj.end_date);
};

/**@description: 언론사 목록 조회 */
const fetchPressList = async () => {
  const response = await ModulesAPI.getPressList();

  const { press_list } = response?.data ?? [];

  if (press_list && press_list.length > 0) {
    pressList.value = press_list.map((item: any) => ({
      id: item.press_no,
      name: item.press_name,
    }));
  }
};

/**@description: 기사 목록 조회 */
const fetchSaveNewsList = async () => {
  timeLoading.value = true;

  if (pagenation.current === 1) {
    newsList.value = [];
  }

  if (pagenation.isMax) {
    hideLoading();
    timeLoading.value = false;
    return;
  }

  const skip = (pagenation.current - 1) * pagenation.limit;

  const response = await KeywordAPI.fetchNewsSaveList({
    ...filterObj,
    skip: skip,
    limit: pagenation.limit,
  });

  const { newslist } = response?.data ?? [];

  if (newslist && newslist.length) {
    newsList.value = [
      ...newsList.value,
      ...newslist.map((item: any) => ({
        ...item,
        keyword: decodeURIComponent(item.keyword),
      })),
    ];
    pagenation.isMax = newslist.length < pagenation.limit;
  } else {
    pagenation.isMax = true;
  }
  // newsList.value = newsList.value.sort((a, b) => (a.pub_date = b.pub_date));

  hideLoading();
  timeLoading.value = false;
};

/**@description: 무한 스크롤 */
const infiniteScrolling = async ({ target }: Event) => {
  if (!target || pagenation.isMax || loading.value) return;
  const currentTarget = target as HTMLElement;
  // offsetHeight
  if (timeLoading.value) return;
  const DOC_HEIGHT = Number(currentTarget.clientHeight || 0);
  const SCROLL_HEIGHT = Number(currentTarget.scrollHeight || 0);
  const IS_BOTTOM =
    SCROLL_HEIGHT - DOC_HEIGHT * pagenation.current <= currentTarget.scrollTop;

  if (IS_BOTTOM) {
    showLoading();
    pagenation.current++;

    setTimeout(async () => {
      await fetchSaveNewsList();
    }, 500);
  }
};

/**@description: 뉴스 목록 조회 */
const handleSearch = async (key: string, data: any) => {
  const { selected_id, selected, type } = data;
  switch (key) {
    case "keyword": {
      if (searchKeyword.value.length >= 10) {
        showNoti({
          message: "10개 이상 등록 불가.",
        });
        return;
      }

      // 검색하려는 조건이 이미 세팅 되어있으면 스킵
      if (JSON.stringify(selected) === JSON.stringify(searchKeyword.value))
        return;
      const keywordOrgCnt = searchKeyword.value.length;
      let filterKey = data.type === "include" ? "in_keyword" : "not_keyword";

      const filterKeywordName = searchKeyword.value.map((item) => item.name);
      let tempKeywordNameList = [];

      for (const idx in selected) {
        const item = selected[idx];

        if (!filterKeywordName.includes(item.name)) {
          tempKeywordNameList.push(item);
        }
      }
      const keywordFilterObj = filterObj as any;

      if (keywordFilterObj[filterKey].length < selected_id.length) {
        searchKeyword.value = Array.from(
          new Set([
            ...searchKeyword.value,
            ...tempKeywordNameList.map((item) => ({
              ...item,
              type: type,
            })),
          ])
        );
      } else {
        const removeIdIdx = searchKeyword.value.findIndex(
          (item) => !selected_id.includes(item.id)
        );
        searchKeyword.value.splice(removeIdIdx, 1);
      }

      if (keywordOrgCnt === searchKeyword.value.length) return;
      keywordFilterObj[filterKey] = [...selected_id];

      break;
    }
    case "press_no": {
      if (searchPress.value.length >= 10) {
        showNoti({
          message: "10개 이상 등록 불가.",
        });
        return;
      }
      // 검색하려는 조건이 이미 세팅 되어있으면 스킵
      if (JSON.stringify(selected) === JSON.stringify(searchPress.value))
        return;
      const orgCnt = searchPress.value?.length || 0;
      let filterPressKey =
        data.type === "include" ? "in_press_no" : "not_press_no";
      const filterPressName = searchPress.value.map((item) => item.name);
      let tempNameList = [];

      for (const idx in selected) {
        const item = selected[idx];

        if (!filterPressName.includes(item.name)) {
          tempNameList.push(item);
        }
      }
      let pressFilterObj = filterObj as any;

      if (pressFilterObj[filterPressKey].length < selected_id.length) {
        searchPress.value = Array.from(
          new Set([
            ...searchPress.value,
            ...tempNameList.map((item) => ({
              ...item,
              type: type,
            })),
          ])
        );
      } else {
        const removeIdIdx = searchPress.value.findIndex(
          (item) => !selected_id.includes(item.id)
        );
        searchPress.value.splice(removeIdIdx, 1);
      }

      if (orgCnt === searchPress.value.length) return;
      pressFilterObj[filterPressKey] = [...selected_id];
      break;
    }
  }
};

/**@description: 초기화 및 데이터 재 조회 */
const refreshList = () => {
  pressList.value = [];
  Promise.all([fetchPressList(), fetchSaveNewsList()]);
};

/**@description: 필터 키워드 제거 */
const removeKeyword = (item: any, index: number) => {
  let filterKey = item.type === "include" ? "in_keyword" : "not_keyword";
  const curFilterObj = (filterObj as any)[filterKey];
  const keyword_idx = curFilterObj.findIndex((obj: any) => item.id == obj);
  searchKeyword.value.splice(index, 1);

  if (keyword_idx < 0) return;

  curFilterObj.splice(keyword_idx, 1);
};

/**@description: 필터 언론사 제거 */
const removePress = (item: any, index: number) => {
  let filterKey = item.type === "include" ? "in_press_no" : "not_press_no";
  const curFilterObj = (filterObj as any)[filterKey];
  const press_no_idx = curFilterObj.findIndex((obj: any) => item.id == obj);
  searchPress.value.splice(index, 1);

  if (press_no_idx < 0) return;

  curFilterObj.splice(press_no_idx, 1);
};

refreshList();
</script>
<style lang="scss" scoped>
.filter-wrap {
  $primary: #556ee6;
  $danger: #f46a6a;

  span.badge.font-size-11 {
    i {
      vertical-align: bottom;
    }
  }
  select {
    text-align: center;
    letter-spacing: 1.5px;
    font-weight: 900;
    &.include {
      color: rgba($primary, 0.8);
    }
    &.exclude {
      color: rgba($danger, 0.8);
    }
  }
  dl {
    border: 2px solid #e2e6e9;
    border-radius: 4px;
    background-color: #e2e6e9;
    hr {
      border-width: 2px;
      border-color: #fff;
    }

    dt {
      border-radius: 4px;
    }
    dd {
      background-color: #fff;
      hr {
        border-width: 1px;
        border-color: #999;
        border-style: dashed;
      }
    }
  }
}
</style>
