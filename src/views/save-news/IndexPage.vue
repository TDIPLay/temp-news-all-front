<template>
  <div class="home">
    <MainLayout @content-scroll="infiniteScrolling">
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-18"> 저장 뉴스 </span>
            </div>
          </div>
        </template>
      </PageHeader>

      <!-- 키워드 조회  필터 (포함, 불포함, 기간) -->
      <h5 class="font-size-14 p-2 text-dark text-start">
        <i class="mdi mdi-filter-outline align-middle"></i>
        필터
      </h5>
      <div class="filter-wrap px-4">
        <dl class="row align-items-center mb-0 text-start">
          <dt class="col-sm-2 py-2 text-sm-center">키워드</dt>
          <dd class="col-sm-10 px-1 px-sm-2 mb-0">
            <template v-for="(kType, kIdx) in keywordTypeList">
              <SearchBarCustom
                v-if="keywordType == kType.value"
                :key="kIdx"
                title="키워드"
                :id="`${kType.key}_keyword`"
                :default-selected="filterObj[`${kType.key}_keyword`]"
                :max-count="10"
                :cur-count="searchKeyword.length"
                :placeholder="`최대 10개까지 복수 분석가능`"
                :type="kType.value"
                :hide-selected-item="true"
                @set-item="(val:any) => handleSearch('keyword', val)"
              >
                <template #prepend>
                  <select
                    v-model="keywordType"
                    :class="`col-auto form-control w-auto ${keywordType}`"
                  >
                    <option value="include">포함</option>
                    <option value="exclude">제외</option>
                  </select>
                </template>
              </SearchBarCustom>
            </template>
            <!---------- 선택한 키워드 목록 ---------->
            <div class="row m-0 align-center" v-if="searchKeyword.length">
              <div class="col row align-items-center m-0 ps-1">
                <hr class="my-auto col me-2" />
                <span
                  class="col-auto badge rounded-pill font-size-11 ms-2 badge-soft-info"
                >
                  {{ searchKeyword.length }}개 적용
                </span>
              </div>
              <div class="col-auto ps-0">
                <i
                  :class="`bx bx-${
                    showFilterList.press_no ? 'up' : 'down'
                  }-arrow`"
                  style="margin-left: 4px"
                  @click="showFilterList.press_no = !showFilterList.press_no"
                ></i>
              </div>
              <div
                class="col-12 row justify-content-start m-0 mb-1 pe-0 g-1"
                v-show="showFilterList.press_no"
              >
                <span
                  v-for="(item, pIdx) in searchKeyword"
                  :key="pIdx"
                  class="col-auto badge rounded-pill font-size-11 me-2"
                  :class="{
                    'badge-soft-primary': item.type == 'include',
                    'badge-soft-danger': item.type != 'include',
                  }"
                >
                  {{ item.name }}
                  <i
                    class="bx bx-x-circle"
                    style="margin-left: 4px"
                    @click="removeKeyword(item, pIdx)"
                  ></i>
                </span>
              </div>
            </div>
          </dd>

          <dt class="col-sm-2 py-2 text-sm-center">언론사</dt>
          <dd class="col-sm-10 px-1 px-sm-2 mb-0">
            <template v-for="(kType, kIdx) in keywordTypeList">
              <SearchBarCustom
                v-if="processKeywordType == kType.value"
                :key="kIdx"
                title="언론사"
                :id="`${kType.key}_press_no`"
                :default-selected="filterObj[`${kType.key}_press_no`]"
                :autocomplate-list="pressList"
                :max-count="10"
                :cur-count="searchPress.length"
                :placeholder="`최대 10개까지 복수 분석가능`"
                :type="kType.value"
                :hide-selected-item="true"
                @set-item="(val:any) => handleSearch('press_no', val)"
              >
                <template #prepend>
                  <select
                    v-model="processKeywordType"
                    :class="`col-auto form-control w-auto ${processKeywordType}`"
                  >
                    <option value="include">포함</option>
                    <option value="exclude">제외</option>
                  </select>
                </template>
              </SearchBarCustom>
            </template>

            <!---------- 선택한 언론사 목록 ---------->
            <div class="row m-0 align-center" v-if="searchPress.length">
              <div class="col row align-items-center m-0 ps-1">
                <hr class="my-auto col me-2" />
                <span
                  class="col-auto badge rounded-pill font-size-11 ms-2 badge-soft-info"
                >
                  {{ searchPress.length }}개 적용
                </span>
              </div>
              <div class="col-auto ps-0">
                <i
                  :class="`bx bx-${
                    showFilterList.press_no ? 'up' : 'down'
                  }-arrow`"
                  style="margin-left: 4px"
                  @click="showFilterList.press_no = !showFilterList.press_no"
                ></i>
              </div>
              <div
                class="col-12 row justify-content-start m-0 mb-1 pe-0 g-1"
                v-show="showFilterList.press_no"
              >
                <span
                  v-for="(item, pIdx) in searchPress"
                  :key="pIdx"
                  class="col-auto badge rounded-pill font-size-11 me-2"
                  :class="{
                    'badge-soft-primary': item.type == 'include',
                    'badge-soft-danger': item.type != 'include',
                  }"
                >
                  {{ item.name }}
                  <i
                    class="bx bx-x-circle"
                    style="margin-left: 4px"
                    @click="removePress(item, pIdx)"
                  ></i>
                </span>
              </div>
            </div>
          </dd>

          <dt class="col-sm-2 py-2 text-sm-center">기간</dt>
          <dd class="d-flex col-sm-10 px-1 px-sm-2 m-0 align-items-center py-1">
            <div class="col">
              <DatePicker
                :class="'form-control date-picker'"
                v-model="tempData.start_date"
                :first-day-of-week="1"
                format="YYYY-MM-DD"
                lang="kr"
                placeholder="시작일"
                confirm
                @update:model-value="
                  filterObj.start_date = moment(tempData.start_date).format(
                    'YYYY-MM-DD'
                  )
                "
              ></DatePicker>
            </div>
            <span class="p-1 p-sm-2"> ~ </span>
            <div class="col">
              <DatePicker
                class="form-control col date-picker"
                v-model="tempData.end_date"
                :first-day-of-week="1"
                lang="kr"
                placeholder="종료일"
                confirm
                @update:model-value="
                  filterObj.end_date = moment(tempData.end_date).format(
                    'YYYY-MM-DD'
                  )
                "
              ></DatePicker>
            </div>
          </dd>
        </dl>

        <button
          class="btn btn-outline-secondary ms-auto mt-2"
          style="width: 100px"
          :disabled="loading"
          @click="initFilter"
        >
          초기화
        </button>

        <button
          class="btn btn-secondary ms-3 mt-2"
          :disabled="loading"
          style="width: 100px"
          @click="
            () => {
              showLoading();
              pagenation.isMax = false;
              fetchSaveNewsList();
            }
          "
        >
          조회
        </button>
      </div>

      <div class="row m-0 mt-4">
        <template v-if="newsList.length">
          <NewsCardItem
            v-for="(news, index) in newsList"
            :key="index"
            :index="index"
            :news-data="{
              ...news,
              save_status: true,
            }"
            :id="news.news_no"
          />
        </template>
        <div class="col" v-else>
          <div class="card" style="min-height: calc(100vh - 560px)">
            <div
              class="card-body row justify-content-center align-items-center"
            >
              <h4 class="card-title">
                <img
                  src="@/assets/img/no-data.png"
                  style="max-width: 250px"
                  class="mb-4"
                />
                <br />
                저장 뉴스가 존재하지 않습니다.
              </h4>
            </div>
          </div>
        </div>
        <!-- end col -->
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
