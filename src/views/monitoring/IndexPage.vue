<template>
  <div class="home">
    <MainLayout @content-scroll="infiniteScrolling" :footer-hide="true">
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-18">
                {{ pageInfo.title }}
              </span>
            </div>
          </div>
        </template>
        <template #right>
          <button
            class="btn btn-outline-danger px-2 py-1 font-size-13"
            @click="handleSettingClick(2)"
          >
            <i class="mdi mdi-bell-outline"></i>
            <span class="d-none d-sm-inline"> 알림 설정 </span>
          </button>
        </template>
      </PageHeader>
      <!-- 키워드 그룹 Header -->
      <div class="row justify-content-start m-0">
        <div
          class="card-title col-auto col-sm-12 text-start d-flex align-items-center"
        >
          <div class="font-size-13 badge badge-soft-secondary py-0 pe-0 ps-3">
            <span class="d-none d-sm-inline">키워드</span>
            그룹
            <select
              v-model="tempSltGroupVal"
              :class="`d-inline-block w-auto form-select keyword_group_select ms-3`"
              @update:model-value="(val:string) => handleKeywordGroupClick(val)"
            >
              <option value="" disabled v-if="!tempSltGroupVal">
                그룹을 선택해 주세요.
              </option>
              <option
                v-for="(group, gIdx) in keywordsGroupList"
                :key="gIdx"
                :value="group.group_no"
              >
                {{ group.group_name }}
              </option>
            </select>
          </div>

          <!-- 키워드 그룹 수정 -->

          <button
            type="button"
            class="btn noti-icon right-bar-toggle toggle-right px-1 py-0"
            @click="
              () => {
                if (loading) return;
                showKeywordGroupModal.info = true;
              }
            "
          >
            <i
              class="bx bx-cog toggle-right"
              :class="{
                'bx-spin': !showKeywordGroupModal.list,
              }"
            ></i>
          </button>

          <!-- <i
            class="btn bx bx-pencil p-1 m-1 my-auto font-size-20"
            @click="
              () => {
                if (!selectedKeywordGroup || loading) return;
                showKeywordGroupModal.info = true;
              }
            "
          ></i> -->

          <!-- 키워드 그룹 추가 -->
          <!-- <i
            class="btn bx bxs-plus-square p-1 my-auto font-size-20"
            @click="
              () => {
                if (loading) return;
                showKeywordGroupModal.create = true;
              }
            "
          ></i> -->
        </div>

        <div
          class="col-12 row justify-content-start pa-0 pb-1 g-1 mt-0"
          v-if="selectedKeywordGroup"
        >
          <span
            v-for="(keyword, idx) in selectedKeywordGroup.keyword_list"
            :key="idx"
            class="col-auto badge rounded-pill font-size-11 ms-2"
            :class="{
              'badge-soft-primary': filterObj.keyword_no.includes(
                keyword.keyword_no
              ),
              'badge-soft-secondary': !filterObj.keyword_no.includes(
                keyword.keyword_no
              ),
            }"
            @click="
              handleKeywordClick(
                selectedKeywordGroup.group_no,
                keyword.keyword_no
              )
            "
          >
            {{ keyword.keyword }}
            <i class="bx bx-x-circle" style="margin-left: 4px"></i>
          </span>

          <!-- <span @click="addKeywordModal(selectedKeywordGroup.group_no)">키워드 추가</span> -->
        </div>
      </div>

      <!-- 키워드 조회  필터 (포함, 불포함, 기간) -->
      <div class="filter-wrap px-4 pt-3">
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
                    @click="removeKeyword(item, index)"
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
                    @click="removePress(item, index)"
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
                :upper-limit="tomorrow"
                @update:model-value="
                  filterObj.start_date = moment(tempData.start_date).format(
                    'YYYY-MM-DD'
                  )
                "
              >
              </DatePicker>
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
                :upper-limit="tomorrow"
                @update:model-value="
                  filterObj.end_date = moment(tempData.end_date).format(
                    'YYYY-MM-DD'
                  )
                "
              ></DatePicker>
            </div>
          </dd>

          <dt class="col-sm-2 py-2 text-sm-center">채널</dt>
          <dd class="d-flex col-sm-10 px-1 px-sm-2 m-0 align-items-center py-1">
            <div class="col py-1 d-flex">
              <div
                class="col form-check form-switch font-size-13 mb-0 ms-1"
                style="max-width: 100px"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="switch_news"
                  name="filter_platform"
                  :value="1"
                  v-model="filterObj.platform"
                />
                <label class="form-check-label" for="switch_news"> 뉴스 </label>
              </div>

              <div
                class="col form-check form-switch font-size-13 mb-0"
                style="max-width: 100px"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="switch_cafe"
                  name="filter_platform"
                  :value="2"
                  v-model="filterObj.platform"
                />
                <label class="form-check-label" for="switch_cafe"> 카페 </label>
              </div>

              <div
                class="col form-check form-switch font-size-13 mb-0"
                style="max-width: 100px"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="switch_blog"
                  name="filter_platform"
                  :value="3"
                  v-model="filterObj.platform"
                />
                <label class="form-check-label" for="switch_blog">
                  블로그
                </label>
              </div>
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
          :disabled="!selectedKeywordGroup || loading"
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
      <div class="mt-4 d-flex justify-content-end pe-3">
        <div class="col-auto form-check form-switch font-size-13 mb-0 me-4">
          <input
            class="form-check-input"
            type="checkbox"
            id="switch_positive"
            v-model="contentFilterObj.positive"
          />
          <label class="form-check-label" for="switch_positive"> 긍정 </label>
        </div>

        <div class="col-auto form-check form-switch font-size-13 mb-0 me-4">
          <input
            class="form-check-input"
            type="checkbox"
            id="switch_negative"
            v-model="contentFilterObj.negative"
          />
          <label class="form-check-label" for="switch_negative"> 부정 </label>
        </div>

        <div class="col-auto form-check form-switch font-size-13 mb-0">
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
                모니터링 뉴스가 존재하지 않습니다.
              </h4>
            </div>
          </div>
        </div>
        <!-- end col -->
      </div>
    </MainLayout>

    <GroupManageModal
      v-if="showKeywordGroupModal.info"
      :id="selectedKeywordGroup ? selectedKeywordGroup.group_no : ''"
      @close="showKeywordGroupModal.info = false"
      @refresh="(isClear = false) => refreshList(isClear)"
    />
    <b-modal
      v-model="showKeywordGroupModal.list"
      size="sm"
      centered
      title="키워드 그룹 관리"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      @close="
        () => {
          showKeywordGroupModal.list = false;
        }
      "
    >
      <ul class="group_manage_modal px-0">
        <li
          v-for="(group, gIdx) in keywordsGroupList"
          :key="gIdx"
          class="row align-items-center"
          :class="{
            'bg-body': gIdx % 2 == 0,
          }"
          @click.stop="handleKeywordGroupClick(group.group_no)"
        >
          <div class="col-auto">
            <button
              type="button"
              class="btn font-size-20 text-primary px-1 py-0"
              @click.stop="handleKeywordGroupClick(group.group_no)"
            >
              <i
                class="bx"
                :class="{
                  'bx-check-square':
                    group.group_no == selectedKeywordGroup?.group_no,
                  'bx-square': group.group_no != selectedKeywordGroup?.group_no,
                }"
              ></i>
            </button>
          </div>
          <div class="col ps-0 overflow-text fw-bold">
            {{ group.group_name }}
            <span class="font-size-11 fw-light">
              ({{ group.keyword_list.length }})</span
            >
          </div>
          <div class="col-auto">
            <button
              type="button"
              class="btn font-size-20 text-danger px-1 py-0"
              @click.stop="keywordGroupDelete(group.group_no)"
            >
              <i class="bx bx bx-trash-alt"></i>
            </button>
          </div>
        </li>
      </ul>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";

import PageHeader from "@/components/layouts/page-header.vue";
import SearchBarCustom from "@/components/search/SearchBarCustom.vue";
import NewsCardItem from "@/components/monitoring/CardItem.vue";
import GroupManageModal from "@/components/monitoring/GroupManageModal.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import DatePicker from "vue3-datepicker";

import { NewListItem, ScrapKeywordGroup } from "@/models/scrap";
import { useCommonStore } from "@/store/common";
import { OptionItemProps } from "@/utils/CommonUtils";

import { KeywordAPI } from "@/api/keyword";
import { ModulesAPI } from "@/api/module";
const props = defineProps({
  groupNo: {
    type: String,
    default: undefined,
    required: false,
  },
  searchParams: {
    type: String,
    default: undefined,
    required: false,
  },
});

interface IFilterObj {
  nlp_score?: string[];
  nlp_keyword?: string[];
  repoter?: string[];
  keyword_no: string[];
  in_keyword: string[];
  not_keyword: string[];
  in_press_no: number[];
  not_press_no: number[];
  platform: number[];
  start_date: string;
  end_date: string;
}
const pageInfo = {
  title: "모니터링",
};
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
const { loading, showLoading, hideLoading, showNoti } = useCommonStore();
const router = useRouter();
const showKeywordGroupModal = reactive({
  info: false,
  list: false,
  keyword: false,
  create: false,
});

const showFilterList = reactive({
  keyword: true,
  press_no: true,
}); // 필터 펼침 여부
const openKeywordGroups = ref<string[]>([]);
const pressList = ref<OptionItemProps[]>([]);
const keywordsGroupList = ref<ScrapKeywordGroup[]>([]);
const selectedKeywordGroup = ref<ScrapKeywordGroup>();
const searchPress = ref<any[]>([]); //언론사 필터
const searchKeyword = ref<any[]>([]); //언론사 필터
const newsList = ref<NewListItem[]>([]);
const keywordType = ref("include");
const processKeywordType = ref("include");
const filterObj = reactive<IFilterObj>({
  keyword_no: [],
  in_keyword: [],
  not_keyword: [],
  in_press_no: [],
  not_press_no: [],
  start_date: moment().subtract(7, "days").format("YYYY-MM-DD"),
  end_date: moment().format("YYYY-MM-DD"),
  platform: [1, 2, 3],
});
const contentFilterObj = reactive({
  positive: true, // 긍정
  negative: true, // 부정
  neutrality: true, // 중립
});
const tomorrow = new Date(moment().add(1, "days").format("YYYY-MM-DD"));
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
const tempSltGroupVal = ref("");
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
  filterObj.keyword_no =
    selectedKeywordGroup.value?.keyword_list.map((item) => item.keyword_no) ??
    [];
  filterObj.in_keyword =
    filterObj.not_keyword =
    filterObj.in_press_no =
    filterObj.not_press_no =
      [];
  filterObj.platform = [1, 2, 3];
  filterObj.start_date = moment().subtract(7, "d").format("YYYY-MM-DD");
  filterObj.end_date = moment().format("YYYY-MM-DD");
  tempData.start_date = new Date(filterObj.start_date);
  tempData.end_date = new Date(filterObj.end_date);
};
/**@description: 키워드 그룹 하단 - 필터링 된 키워드 목록*/
const filteredSelectedKeywords = computed(() => {
  return selectedKeywordGroup.value?.keyword_list.filter((item) =>
    filterObj.keyword_no.includes(item.keyword_no)
  );
});

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

/**@description: 키워드 그룹 목록 조회 */
const fetchKeywordGroupList = async (group_no?: string) => {
  const response = await KeywordAPI.getKeyWordGroups();

  const { data } = response;

  if (data && data.length > 0) {
    keywordsGroupList.value = data.map(
      (item: any) => new ScrapKeywordGroup(item)
    );
  }
  openKeywordGroups.value = [];

  if (keywordsGroupList.value.length > 0) {
    handleKeywordGroupClick(
      group_no ? group_no : keywordsGroupList.value[0].group_no,
      !!props.searchParams
    );
  }
};

/**@description: 키워드 그룹 선택시 */
const handleKeywordGroupClick = async (group_no: string, useProps = false) => {
  showKeywordGroupModal.list = false;
  const keywordGrooup = keywordsGroupList.value.find(
    (item) => item.group_no === group_no
  );

  if (
    keywordGrooup &&
    !openKeywordGroups.value.includes(keywordGrooup.group_no)
  ) {
    openKeywordGroups.value = [keywordGrooup.group_no];
  } else {
    openKeywordGroups.value = [];
  }

  // 동일한 조건이면 return
  if (
    keywordGrooup &&
    selectedKeywordGroup.value?.group_no === group_no &&
    filterObj.keyword_no.length === keywordGrooup.keyword_list.length
  )
    return;

  pagenation.current = 1;
  pagenation.isMax = false;
  newsList.value = [];

  selectedKeywordGroup.value = keywordGrooup;
  tempSltGroupVal.value = keywordGrooup?.group_no ?? "";

  showLoading();
  filterObj.keyword_no =
    selectedKeywordGroup.value?.keyword_list.map((item) => item.keyword_no) ??
    [];

  if (useProps) {
    // console.log(props);
    const searchParams = props.searchParams
      ? JSON.parse(props.searchParams)
      : null;

    if (searchParams && searchParams.keyword_no) {
      filterObj.keyword_no = [...searchParams.keyword_no];
    }

    if (searchParams && searchParams.start_date) {
      filterObj.start_date = searchParams.start_date;
      tempData.start_date = new Date(searchParams.start_date);
    }
    if (searchParams && searchParams.end_date) {
      filterObj.end_date = searchParams.end_date;
      tempData.end_date = new Date(searchParams.end_date);
    }
    if (searchParams && searchParams.nlp_score) {
      filterObj.nlp_score = [...searchParams.nlp_score];
    }
    if (searchParams && searchParams.nlp_keyword) {
      filterObj.nlp_keyword = [...searchParams.nlp_keyword];
    }
    if (searchParams && searchParams.in_press_no) {
      filterObj.in_press_no = [...searchParams.in_press_no];
    }
    if (searchParams && searchParams.repoter) {
      filterObj.repoter = [...searchParams.repoter];
    }

    history.replaceState({}, "", location.pathname);
  }

  await fetchNewsList();
};

/**@description: 키워드 선택시 */
const handleKeywordClick = async (group_no: string, keyword_no: string) => {
  // 동일한 조건이면 return

  if (!selectedKeywordGroup.value) return;

  if (
    selectedKeywordGroup.value?.group_no === group_no &&
    filterObj.keyword_no.length === 1 &&
    filterObj.keyword_no[0] === keyword_no
  ) {
    showNoti({
      message: "최소 한가지 키워드를 선택해 주세요.",
    });
  }

  pagenation.current = 1;
  pagenation.isMax = false;

  if (selectedKeywordGroup.value.group_no !== group_no) {
    filterObj.keyword_no = [];
  }

  openKeywordGroups.value = [group_no];

  const keywordGrooup = keywordsGroupList.value.find(
    (item) => item.group_no === group_no
  );

  selectedKeywordGroup.value = keywordGrooup;
  tempSltGroupVal.value = keywordGrooup?.group_no ?? "";
  let keywordIdx = filterObj.keyword_no.findIndex(
    (item) => item === keyword_no
  );
  if (keywordIdx < 0) {
    filterObj.keyword_no.push(keyword_no);
  } else {
    filterObj.keyword_no.splice(keywordIdx, 1);
  }
};

/**@description: 기사 목록 조회 */
const fetchNewsList = async (init = false) => {
  timeLoading.value = true;
  if (init) {
    pagenation.current = 1;
  }
  if (pagenation.current === 1) {
    newsList.value = [];
  }

  if (!filterObj.keyword_no.length) {
    hideLoading();
    showNoti({
      message: "최소 한가지 키워드를 선택해 주세요.",
    });
    timeLoading.value = false;
    return;
  }

  if (pagenation.isMax) {
    hideLoading();
    timeLoading.value = false;
    return;
  }

  const skip = (pagenation.current - 1) * pagenation.limit;

  const response = await KeywordAPI.fetchScrapKeyWord({
    ...filterObj,
    keyword_no: filterObj.keyword_no,
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
      await fetchNewsList();
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
const refreshList = (clear = false) => {
  // 더보기로 이동한 경우
  let group_no = props.groupNo ? props.groupNo : undefined;

  if (clear) {
    selectedKeywordGroup.value = undefined;
  }

  if (selectedKeywordGroup.value) {
    group_no = selectedKeywordGroup.value
      ? selectedKeywordGroup.value?.group_no
      : group_no;
  }

  keywordsGroupList.value = [];
  pressList.value = [];
  // topNewsList.value = [];
  Promise.all([
    fetchPressList(),
    fetchKeywordGroupList(
      selectedKeywordGroup.value
        ? selectedKeywordGroup.value?.group_no
        : group_no
    ),
  ]);

  // fetchTopNewsList();
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

// 키워드 그룹이름 저장
const keywordGroupSave = async (props: any) => {
  showLoading();

  const resGroup = props.id
    ? await KeywordAPI.updateKeyWordGroup({
        division: "modify",
        group_no: props.id,
        group_name: props.input,
      })
    : await KeywordAPI.createKeyWordGroup({
        division: "regist",
        group_name: props.input,
      });

  const { result, message } = resGroup.data;
  hideLoading();
  showNoti({
    message: message,
  });

  if (result) {
    showKeywordGroupModal.info = false;
    fetchKeywordGroupList(selectedKeywordGroup.value?.group_no);
  }
};

/**@description: 키워드 그룹 삭제 */
const keywordGroupDelete = async (group_no: string) => {
  Swal.fire({
    text: "그룹의 하위 키워드도 함께 삭제 됩니다. 키워드 그룹을 삭제하시겠습니까?",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then(async (res) => {
    if (res.value) {
      showLoading();

      const resGroup = await KeywordAPI.deleteKeyWordGroup(group_no);

      const { result, message } = resGroup.data;

      hideLoading();

      if (result) {
        showKeywordGroupModal.info = false;
        fetchKeywordGroupList();
      }

      showNoti({
        message: message,
      });
    }
  });
};

/**@description: 알림설정 페이지로 이동 */
const handleSettingClick = (idx: number) => {
  router.push({
    name: "setting",
    query: {
      tabIdx: idx ? idx : 0,
    },
  });
};

refreshList();
</script>
<style lang="scss" scoped>
.keyword_group_select {
  font-weight: bold;
  min-width: 120px;
}
.group_manage_modal {
  .btn-primary {
    // background-color: #556ee6 !important;
  }
  ul {
    max-height: 300px;
    overflow: auto;
  }
  li {
    cursor: pointer;
    transition: all 0.4s;
    &:hover div:first-child i {
      transform: scale(1.2);
    }
  }
}

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
