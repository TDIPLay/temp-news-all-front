<template>
  <div class="home">
    <MainLayout>
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-18"> 집계 분석</span>
            </div>
          </div>
        </template>
      </PageHeader>

      <div class="filter-wrap px-4">
        <dl class="row align-items-center mb-0 text-start">
          <dt class="col-sm-2 py-2 text-sm-center">키워드 그룹</dt>
          <dd class="col-sm-10 p-1 px-sm-2 mb-0">
            <select
              v-model="tempSltGroupVal"
              :class="`form-select keyword_group_select `"
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
          </dd>
          <dt class="col-sm-2 py-2 text-sm-center">키워드</dt>
          <dd class="col-sm-10 p-1 py-2 px-sm-2 mb-0">
            <div
              class="col-12 row justify-content-start pa-0 pb-1 g-1 mt-0"
              v-if="selectedKeywordGroup"
            >
              <span
                v-for="(keyword, idx) in selectedKeywordGroup.keyword_list"
                :key="idx"
                class="col-auto badge rounded-pill font-size-11 ms-2"
                :class="{
                  'badge-soft-primary': selectedKeywordNoList.includes(
                    keyword.keyword_no
                  ),
                  'badge-soft-secondary': !selectedKeywordNoList.includes(
                    keyword.keyword_no
                  ),
                }"
                @click="handleKeywordClick(keyword)"
              >
                {{ keyword.keyword }}
                <i class="bx bx-x-circle" style="margin-left: 4px"></i>
              </span>
            </div>
            <h4
              v-else
              class="d-felx my-1 font-size-13 fw-bolder text-center align-items-center text-secondary"
            >
              키워드 그룹에 등록된 키워드가 없습니다.
            </h4>
          </dd>
          <dt class="col-sm-2 py-2 text-sm-center">기간</dt>
          <dd class="d-flex col-sm-10 px-1 px-sm-2 m-0 align-items-center py-1">
            <div class="col">
              <DatePicker
                :class="'form-control date-picker'"
                v-model="tempData.startDate"
                :first-day-of-week="1"
                format="YYYY-MM-DD"
                lang="kr"
                placeholder="시작일"
                confirm
                :upper-limit="today"
                @update:model-value="
                  searchDate.startDate = moment(tempData.startDate).format(
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
                v-model="tempData.endDate"
                :first-day-of-week="1"
                lang="kr"
                placeholder="종료일"
                confirm
                :upper-limit="today"
                @update:model-value="
                  searchDate.endDate = moment(tempData.endDate).format(
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
          :disabled="!selectedKeywordGroup || loading"
          style="width: 100px"
          @click="
            () => {
              // 해당 로더는 표시 안됨
              showLoading(false);
              // fetchNewsRank(searchDate);
              // fetchNewsRankTingSearch(searchDate);
            }
          "
        >
          조회
        </button>
      </div>

      <div class="analyze_tab d-flex mt-3 pt-3">
        <ul class="col nav nav-pills nav-justified d-flex d-sm-inline-flex">
          <li class="nav-item" v-for="(tab, tIdx) in tabMenuList" :key="tIdx">
            <button
              class="nav-link py-3"
              :class="{
                active: tabIdx == tIdx,
              }"
              data-bs-toggle="tab"
              :data-bs-target="`#t${tab.id}`"
              role="tab"
              :aria-controls="tab.id"
              :aria-selected="tabIdx == tIdx"
              @click="tabIdx = tIdx"
            >
              {{ tab.label }}
            </button>
          </li>
        </ul>
      </div>

      <div class="card tab-content p-3 text-muted">
        <div
          id="tab_analyze_new show"
          class="tab-pane border-0 card-body"
          :class="{
            'active ': tabIdx == 0,
            fade: tabIdx != 0,
          }"
          role="tabpanel"
          aria-labelledby="tab_analyze_new"
        >
          <NewsTab
            v-if="selectedKeywordGroup"
            :group-no="selectedKeywordGroup.group_no"
            :keyword-list="selectedKeywordNoList"
            :start-date="searchDate.startDate"
            :end-date="searchDate.endDate"
            :is-active="tabIdx == 0"
          />
        </div>
        <div
          id="tab_analyze_trand"
          class="tab-pane border-0 card-body"
          :class="{
            'active show': tabIdx == 1,
            fade: tabIdx != 1,
          }"
          role="tabpanel"
          aria-labelledby="tab_analyze_trand"
        >
          <TrendTab
            v-if="selectedKeywordGroup"
            :group-no="selectedKeywordGroup.group_no"
            :keyword-list="selectedKeywordNoList"
            :start-date="searchDate.startDate"
            :end-date="searchDate.endDate"
            :is-active="tabIdx == 1"
          />
        </div>
        <div
          id="tab_analyze_keyword show"
          class="tab-pane border-0 card-body"
          :class="{
            'active ': tabIdx == 2,
          }"
          role="tabpanel"
          aria-labelledby="tab_analyze_keyword"
        >
          <KeywordTab
            v-if="selectedKeywordGroup"
            :group-no="selectedKeywordGroup.group_no"
            :keyword-list="selectedKeywordTextList"
            :start-date="searchDate.startDate"
            :end-date="searchDate.endDate"
            :is-active="tabIdx == 2"
          />
        </div>
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import moment from "moment";

import DatePicker from "vue3-datepicker";
import PageHeader from "@/components/layouts/page-header.vue";
import TrendTab from "@/components/analyze/TrendTab.vue";
import KeywordTab from "@/components/analyze/KeywordTab.vue";
import NewsTab from "@/components/analyze/NewsTab.vue";
import MainLayout from "@/layouts/MainLayout.vue";

import { useCommonStore } from "@/store/common";
import { ScrapKeyword, ScrapKeywordGroup } from "@/models/scrap";

import { KeywordAPI } from "@/api/keyword";

interface IDatePros {
  startDate: string;
  endDate: string;
}

const { loading, showNoti, showLoading } = useCommonStore();
const tabIdx = ref(0);
const tabMenuList = [
  {
    label: "뉴스 분석",
    id: "tab_analyze_new",
  },
  {
    label: "트랜드 분석",
    id: "tab_analyze_trand",
  },
  {
    label: "키워드 분석",
    id: "tab_analyze_keyword",
  },
];
const today = new Date(moment().format("YYYY-MM-DD"));
const searchDate = reactive({
  startDate: moment().subtract(1, "M").format("YYYY-MM-DD"),
  endDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
});
const tempData = reactive({
  startDate: new Date(searchDate.startDate),
  endDate: new Date(searchDate.endDate),
});
const filterDisabledDates = [new Date()];

const keywordsGroupList = ref<ScrapKeywordGroup[]>([]);
const selectedKeywordGroup = ref<ScrapKeywordGroup>();
const tempSltGroupVal = ref("");
const selectedKeywords = ref<ScrapKeyword[]>([]);

// 팅서치에 표시하는 값
const newsRankInfo = reactive<{
  totalCount: number;
  pressCount: number;
  reporterCount: number;
  daily: any[];
  press: any[];
  repoter: any[];
  competition: any[];
  chart_tablelist: any[];
  daily_keywords?: any;
}>({
  totalCount: 0,
  pressCount: 0,
  reporterCount: 0,
  daily: [],
  press: [],
  repoter: [],
  //-----------
  daily_keywords: null,
  competition: [],
  chart_tablelist: [],
});

const dailyCahrtData = computed(() => {
  if (!newsRankInfo.daily.length || loading.value) return null;

  return {
    xAxis: newsRankInfo.daily.map((item) => item.date) ?? [],
    series: {
      name: "발행수",
      type: "line",
      data: newsRankInfo.daily.map((item) => item.count) ?? [],
    },
    legend: ["발행수"],
  };
});

const selectedKeywordNoList = computed(() =>
  selectedKeywords.value.map((item) => item.keyword_no)
);
const selectedKeywordTextList = computed(() =>
  selectedKeywords.value.map((item) => item.keyword)
);

/**@description: 키워드 그룹 목록 조회 */
const fetchKeywordGroupList = async () => {
  const response = await KeywordAPI.getKeyWordGroups();

  const { data } = response;

  if (data && data.length > 0) {
    keywordsGroupList.value = data.map(
      (item: any) => new ScrapKeywordGroup(item)
    );
  }
};

/**@description: 키워드 그룹 선택시 */
const handleKeywordGroupClick = async (group_no?: string) => {
  if (!group_no) {
    if (!selectedKeywordGroup.value && keywordsGroupList.value) {
      handleKeywordGroupClick(keywordsGroupList.value[0].group_no);
    }
  }

  const keywordGrooup = keywordsGroupList.value.find(
    (item) => item.group_no === group_no
  );

  // 동일한 조건이면 return
  if (
    !keywordGrooup ||
    (keywordGrooup &&
      selectedKeywordGroup.value &&
      selectedKeywordGroup.value?.group_no == keywordGrooup?.group_no)
  )
    return;

  selectedKeywordGroup.value = keywordGrooup;
  tempSltGroupVal.value = selectedKeywordGroup.value
    ? selectedKeywordGroup.value.group_no
    : "";
  selectedKeywords.value = keywordGrooup.keyword_list
    ? [...keywordGrooup.keyword_list]
    : [];
  // 로더 표시는 안하는 상태
  // 각각 탭에서 로더 표시 & 각각 탭에서 로딩 상태가 true 가 되면 데이터 조회
  showLoading(false);
};

/**@description: 키워드 그룹 > 키워드 선택시 */
const handleKeywordClick = async (selectedItem: ScrapKeyword) => {
  if (selectedKeywords.value.length === 1) {
    showNoti({
      message: "최소 1개 이상의 키워드를 선택해야합니다.",
    });
    return;
  }

  const idx = selectedKeywordNoList.value.findIndex(
    (item) => item === selectedItem.keyword_no
  );
  if (idx < 0) {
    selectedKeywords.value.push(selectedItem);
  } else {
    selectedKeywords.value.splice(idx, 1);
  }
};
const init = async () => {
  await fetchKeywordGroupList();
  await handleKeywordGroupClick();
};
init();
</script>

<style lang="scss" scoped>
$primary: #556ee6;
$danger: #f46a6a;
.keyword_group_select {
  font-weight: bold;
  min-width: 120px;
}

.filter-wrap {
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
.analyze_tab {
  ul.nav-pills {
    border-bottom: 1px solid rgba($primary, 0.2);
    .nav-item {
      font-weight: 600;
      font-size: 13px;
      background-color: rgba(gray, 0.1);
      .nav-link {
        color: rgba(gray, 0.7);
        &.active {
          background-color: rgba($primary, 0.1);
          font-weight: 900;
          color: $primary;
          border-top: 3px solid rgba($primary, 0.8);
        }
      }
    }
  }
}
</style>
