<template>
  <div class="home">
    <MainLayout @content-scroll="infiniteScrolling" :footer-hide="true">
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
      <div class="filter-wrap px-2 pt-3">
        <div class="filter-list p-2">
          <div class="row m-0 text-start">
            <div class="col-sm-auto py-2 text-sm-center" style="padding: 12px">
              키워드
            </div>
            <div class="col px-1 px-sm-2 mb-0">
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
                      :class="`col-auto form-select w-auto ${keywordType}`"
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
                </div>
                <div class="col-auto ps-0">
                  <span
                    class="col-auto font-size-11 ms-2 text-secondary"
                    @click="showFilterList.press_no = !showFilterList.press_no"
                  >
                    {{ searchKeyword.length }}개 적용
                  </span>
                  <i
                    :class="`bx bx-${
                      showFilterList.press_no ? 'up' : 'down'
                    }-arrow`"
                    style="margin-left: 4px"
                  ></i>
                </div>
                <div
                  class="col-12 row justify-content-start m-0 mb-1 pe-0 g-1"
                  v-show="showFilterList.press_no"
                >
                  <span
                    v-for="(item, pIdx) in searchKeyword"
                    :key="pIdx"
                    class="col-auto badge font-size-11 me-2 px-2 py-1"
                    :class="{
                      'badge-soft-secondary': item.type == 'include',
                      'bg-soft-negative': item.type != 'include',
                    }"
                    @click="removeKeyword(item, pIdx)"
                  >
                    {{ item.name }}
                    <i
                      class="mdi mdi-close-circle text-soft-secondary"
                      :class="{
                        'text-soft-secondary': item.type == 'include',
                        'text-negative': item.type != 'include',
                      }"
                      style="margin-left: 4px"
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-0 text-start">
            <div class="col-sm-auto text-sm-center" style="padding: 12px">
              언론사
            </div>
            <div class="col px-1 px-sm-2 mb-0">
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
                      :class="`col-auto form-select w-auto ${processKeywordType}`"
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
                  <hr class="my-auto col me-2 m-0" />
                </div>
                <div
                  class="col-auto ps-0"
                  @click="showFilterList.press_no = !showFilterList.press_no"
                >
                  <span class="col-auto font-size-11 ms-2 text-secondary">
                    {{ searchPress.length }}개 적용
                  </span>
                  <i
                    :class="`bx bx-${
                      showFilterList.press_no ? 'up' : 'down'
                    }-arrow`"
                    style="margin-left: 4px"
                  ></i>
                </div>
                <div
                  class="col-12 row justify-content-start m-0 mb-1 pe-0 py-0 g-1"
                  v-show="showFilterList.press_no"
                >
                  <span
                    v-for="(item, pIdx) in searchPress"
                    :key="pIdx"
                    class="col-auto badge font-size-11 me-2 px-2 py-1"
                    :class="{
                      'badge-soft-secondary': item.type == 'include',
                      'bg-soft-negative': item.type != 'include',
                    }"
                    @click="removePress(item, pIdx)"
                  >
                    <span
                      style="max-width: 100px"
                      class="overflow-text d-inline-block"
                    >
                      {{ item.name }}
                    </span>
                    <i
                      class="mdi mdi-close-circle text-soft-secondary"
                      :class="{
                        'text-soft-secondary': item.type == 'include',
                        'text-negative': item.type != 'include',
                      }"
                      style="margin-left: 4px"
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-0 text-start">
            <div
              class="col-sm-auto py-2 text-sm-center d-flex align-items-ccenter"
              style="padding: 12px"
            >
              기간 &nbsp;&nbsp;
            </div>
            <div
              class="d-flex col px-1 px-sm-2 m-0 align-items-center py-1 flex-column flex-md-row"
            >
              <div
                class="col-12 col-md-auto me-2 d-flex pb-2 pb-md-0 ms-2 ms-md-0"
              >
                <button
                  class="btn btn-outline-dark me-2 col col-md-auto"
                  :class="{ 'btn-dark ': selectedSearchDays == 7 }"
                  @click="handleSearchDay(7)"
                >
                  1주일
                </button>
                <button
                  class="btn btn-outline-dark me-2 col col-md-auto"
                  :class="{ 'btn-dark ': selectedSearchDays == 30 }"
                  @click="handleSearchDay(30)"
                >
                  1개월
                </button>
                <button
                  class="btn btn-outline-dark col col-md-auto"
                  :class="{ 'btn-dark ': selectedSearchDays == 90 }"
                  @click="handleSearchDay(90)"
                >
                  3개월
                </button>
              </div>
              <div class="col-12 col-md-auto d-flex">
                <div class="col col-md-auto">
                  <DatePicker
                    :class="'  form-control date-picker'"
                    v-model="tempData.start_date"
                    :first-day-of-week="1"
                    format="YYYY-MM-DD"
                    lang="kr"
                    placeholder="시작일"
                    confirm
                    :upper-limit="tomorrow"
                    @update:model-value="
                      handleUpdateDatePicker('start_date', tempData.start_date)
                    "
                  >
                  </DatePicker>
                </div>

                <span class="p-1 p-sm-2"> ~ </span>
                <div class="col col-md-auto">
                  <DatePicker
                    class="form-control col date-picker"
                    v-model="tempData.end_date"
                    :first-day-of-week="1"
                    lang="kr"
                    placeholder="종료일"
                    confirm
                    :upper-limit="tomorrow"
                    @update:model-value="
                      handleUpdateDatePicker('end_date', tempData.end_date)
                    "
                  ></DatePicker>
                </div>
              </div>
            </div>
          </div>
          <div class="row m-0 text-start">
            <div
              class="col-sm-auto py-2 text-sm-center d-flex align-items-center"
              style="padding: 12px"
            >
              채널 &nbsp;&nbsp;
            </div>
            <div
              class="d-flex col px-1 px-sm-2 m-0 align-items-center py-1 flex-column flex-sm-row"
            >
              <div class="col-12 col-sm-auto py-1 d-flex align-items-center">
                <label
                  class="col col-sm-auto form-check-label px-2"
                  for="switch_news"
                >
                  뉴스
                </label>
                <div
                  class="form-check form-switch form-switch-md form-check-dark font-size-13 mb-0 mx-1"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="switch_news"
                    name="filter_platform"
                    :value="1"
                    v-model="filterObj.platform"
                  />
                </div>
              </div>

              <div class="col-12 col-sm-auto py-1 d-flex align-items-center">
                <label
                  class="col col-sm-auto form-check-label px-2"
                  for="switch_cafe"
                >
                  카페
                </label>
                <div
                  class="form-check form-switch form-switch-md form-check-dark font-size-13 mb-0 mx-1"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="switch_cafe"
                    name="filter_platform"
                    :value="2"
                    v-model="filterObj.platform"
                  />
                </div>
              </div>

              <div class="col-12 col-sm-auto py-1 d-flex align-items-center">
                <label
                  class="col col-sm-auto form-check-label px-2"
                  for="switch_blog"
                >
                  블로그
                </label>
                <div
                  class="form-check form-switch form-switch-md form-check-dark font-size-13 mb-0 mx-1"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="switch_blog"
                    name="filter_platform"
                    :value="3"
                    v-model="filterObj.platform"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <button
            class="btn btn-outline-secondary ms-auto mt-2 col col-sm-auto"
            style="width: 100px"
            :disabled="loading"
            @click="initFilter"
          >
            초기화
          </button>

          <button
            class="btn btn-dark ms-3 mt-2 col col-sm-auto me-auto"
            :disabled="loading"
            style="width: 100px"
            @click="
              () => {
                showLoading();
                pagenation.isMax = false;
                fetchNewsList(true);
              }
            "
          >
            조회
          </button>
        </div>
      </div>

      <div class="mt-4 d-flex justify-content-end pe-3">
        <div
          class="col-auto form-check form-switch form-switch-md form-check-positive font-size-13 mb-0 me-4"
        >
          <input
            class="form-check-input"
            type="checkbox"
            id="switch_positive"
            v-model="contentFilterObj.positive"
          />
          <label class="form-check-label" for="switch_positive"> 긍정 </label>
        </div>

        <div
          class="col-auto form-check form-switch form-switch-md form-check-negative font-size-13 mb-0 me-4"
        >
          <input
            class="form-check-input"
            type="checkbox"
            id="switch_negative"
            v-model="contentFilterObj.negative"
          />
          <label class="form-check-label" for="switch_negative"> 부정 </label>
        </div>

        <div
          class="col-auto form-check form-switch form-switch-md form-check-neutrality font-size-13 mb-0"
        >
          <input
            class="form-check-input"
            type="checkbox"
            id="switch_neutrality"
            v-model="contentFilterObj.neutrality"
          />
          <label class="form-check-label" for="switch_neutrality"> 중립 </label>
        </div>
      </div>

      <div class="row m-0 mt-2">
        <template v-if="filteredNewsList.length">
          <NewsCardItem
            v-for="(news, index) in filteredNewsList"
            :key="index"
            :index="index"
            :news-data="news"
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
import { ref, reactive, computed } from "vue";
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
import { NewListItem } from "@/models/scrap";

interface IFilterObj {
  in_keyword: string[];
  not_keyword: string[];
  in_press_no: number[];
  not_press_no: number[];
  platform: number[];
  start_date: string;
  end_date: string;
}

const tomorrow = new Date(moment().add(1, "days").format("YYYY-MM-DD"));
const { loading, showLoading, hideLoading, showNoti } = useCommonStore();
const showFilterList = reactive({
  keyword: true,
  press_no: true,
}); // 필터 펼침 여부
const pressList = ref<OptionItemProps[]>([]);
const searchPress = ref<any[]>([]); //언론사 필터
const searchKeyword = ref<any[]>([]); //언론사 필터
const newsList = ref<NewListItem[]>([]);
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
const selectedSearchDays = ref(30);

const filterObj = reactive<IFilterObj>({
  in_keyword: [],
  not_keyword: [],
  in_press_no: [],
  not_press_no: [],
  start_date: moment().subtract(30, "days").format("YYYY-MM-DD"),
  end_date: moment().format("YYYY-MM-DD"),
  platform: [1, 2, 3],
});
const contentFilterObj = reactive({
  positive: true, // 긍정
  negative: true, // 부정
  neutrality: true, // 중립
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

const filteredNewsList = computed(() => {
  const temp: number[] = [];
  if (contentFilterObj.positive) temp.push(1);
  if (contentFilterObj.negative) temp.push(-1);
  if (contentFilterObj.neutrality) temp.push(0);
  return newsList.value.filter((item: NewListItem) =>
    temp.includes(item.scoreTypeCode)
  );
});
/**@description: 검색 필터 초기화 */
const initFilter = () => {
  filterObj.in_keyword =
    filterObj.not_keyword =
    filterObj.in_press_no =
    filterObj.not_press_no =
      [];
  filterObj.start_date = moment().subtract(1, "M").format("YYYY-MM-DD");
  filterObj.end_date = moment().format("YYYY-MM-DD");
  tempData.start_date = new Date(filterObj.start_date);
  tempData.end_date = new Date(filterObj.end_date);
  filterObj.platform = [1, 2, 3];
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
const fetchSaveNewsList = async (init = false) => {
  timeLoading.value = true;
  if (init) {
    pagenation.current = 1;
  }
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
      ...newslist.map(
        (item: any) =>
          new NewListItem({
            ...item,
            keyword: decodeURIComponent(item.keyword),
            save_status: true,
          })
      ),
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
    SCROLL_HEIGHT - DOC_HEIGHT <= Math.round(currentTarget.scrollTop);

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

const handleUpdateDatePicker = (
  type: "start_date" | "end_date",
  date: Date
) => {
  filterObj[type] = moment(date).format("YYYY-MM-DD");
  const diffDays = moment
    .duration(moment(filterObj.end_date).diff(filterObj.start_date))
    .asDays(); // 1

  selectedSearchDays.value = [7, 30, 90].includes(diffDays) ? diffDays : 0;
};
const handleSearchDay = (day: number) => {
  selectedSearchDays.value = day;
  const today = moment().format("YYYY-MM-DD");
  filterObj.start_date = moment().subtract(day, "days").format("YYYY-MM-DD");
  filterObj.end_date = today;
  tempData.end_date = new Date(filterObj.end_date);
  tempData.start_date = new Date(filterObj.start_date);
};

refreshList();
</script>
<style lang="scss" scoped>
.filter-wrap {
  $primary: #556ee6;
  $danger: #f46a6a;
  $danger-card: #f68887;
  .filter-list {
    .row {
      padding: 4px 0px;
    }
    background-color: #fff;
  }
  span.badge.font-size-11 {
    i {
      vertical-align: bottom;
    }
  }
  select {
    text-align: center;
    letter-spacing: 1.5px;
    font-weight: 900;
    // &.include {
    //   color: rgba($primary, 0.8);
    // }
    &.exclude {
      color: rgba($danger, 0.8);
    }
  }
}
</style>
