<template>
  <div class="py-3">
    <div class="card-title-index card-title text-start">발행 컨텐츠</div>
    <template v-if="!currentLoading">
      <DailyChart
        :is-active="props.isActive"
        :data="daily_nlp"
        :id="'dailyNlpCahrtData'"
      />
    </template>
    <div
      v-else
      class="no-data d-flex align-items-center justify-content-center"
    >
      <h4 class="card-title">조회중입니다.</h4>
    </div>
  </div>

  <div class="py-3 trend-chart-wrap">
    <div class="card-title-index card-title text-start">전체 채널 반응</div>

    <template v-if="total_chart.series">
      <DonutChart
        :is-active="props.isActive"
        :data="{ series:
      total_chart.series, series_radius: ['85%', '120%' ], series_center:
      ['50%', '65%'], series_angle: 180, series_label: { formatter(param:any) {
        
     
      return param.name + ' \n(' + param.percent * 2 + '%)'; }, }, }"
        :id="'platfrom_total'"
      />
    </template>
    <div
      v-else
      class="no-data d-flex align-items-center justify-content-center"
    >
      <h4 class="card-title">조회중입니다.</h4>
    </div>

    <div class="card-title-index card-title text-start">채널별 호감도 집계</div>
    <div class="d-flex">
      <div class="col col-sm-6 p-2" v-if="blog_chart.series">
        <div
          class="card m-0 p-2"
          :class="{
            active: slideIdx == 0,
          }"
        >
          <DonutChart
            :is-active="props.isActive"
            :data="{ series: blog_chart.series }"
            :tooltip="{ 
              formatter: ({color, name, value, percent}:any) => { 
              let badge = `<span style='display: inline-block; 
               margin-right: 4px; border-radius: 10px; width: 10px; height: 10px;   
                background-color: ${color}; ' ></span >`; 
                
                return`${badge}${name} : ${value} (${percent}%)`
              } 
            }"
            :id="'platfrom_blog'"
            @click="slideIdx = 0"
          />
          <div class="fw-bolder mt-2 p-2">블로그</div>
        </div>
      </div>
      <div class="col col-sm-6 p-2" v-if="cafe_chart.series">
        <div
          class="card m-0 p-2"
          :class="{
            active: slideIdx == 1,
          }"
          @click="slideIdx = 1"
        >
          <DonutChart
            :is-active="props.isActive"
            :data="{
              series: cafe_chart.series,
            }"
            :tooltip="{ 
              formatter: ({color, name, value, percent}:any) => { 
              let badge = `<span style='display: inline-block; 
               margin-right: 4px; border-radius: 10px; width: 10px; height: 10px;   
                background-color: ${color}; ' ></span >`; 
                
                return`${badge}${name} : ${value} (${percent}%)`
              } 
            }"
            :id="'platfrom_cafe'"
          />
          <div class="fw-bolder mt-2 p-2">카페</div>
        </div>
      </div>
    </div>
  </div>

  <div class="py-3 mb-2">
    <div class="card-title-index card-title text-start">
      {{ !slideIdx ? "블로그" : "카페" }} 긍부정 키워드 Top 10
    </div>

    <div class="row mt-2" v-if="slideIdx == 0">
      <div
        v-for="(keywordType, kIdx) in chartData.slice(0, 2)"
        :key="kIdx"
        class="col-12 col-md-6"
      >
        <div class="text-center my-3">
          <span
            class="card-title fw-bolder px-3 py-1"
            :class="{
              'text-positive': keywordType.key_code > 0,
              'text-negative': keywordType.key_code < 0,
            }"
          >
            {{ keywordType.label }} 키워드
          </span>
        </div>
        <div class="pe-0 pe-sm-1">
          <table
            class="table table-striped-odd mb-0"
            :class="{
              'striped-positive': keywordType.key_code > 0,
              'striped-negative': keywordType.key_code < 0,
            }"
          >
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th class="">순위</th>
                <th>키워드</th>
                <th>언급량</th>
              </tr>
            </thead>

            <tbody>
              <template
                v-if="blog_chart[`${keywordType.key}_keyword_rank`]?.length"
              >
                <tr
                  v-for="(keywordRank, index) in blog_chart[
                    `${keywordType.key}_keyword_rank`
                  ]"
                  :key="index"
                  class="rank-list-content"
                  :class="{
                    active:
                      keywordType.key_code == keywordTop10.type &&
                      index == keywordTop10.activeItemIdx,
                  }"
                  @click="
                    handleKeywordRankClick(
                      index,
                      keywordType.key_code,
                      keywordRank.keyword
                    )
                  "
                >
                  <td class="font-size-12">
                    {{ index + 1 }}
                  </td>
                  <td class="font-size-12 fw-bolder">
                    {{ keywordRank.keyword }}
                  </td>
                  <td class="font-size-12">
                    {{ Number(keywordRank.count).toLocaleString() }}
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="3" style="height: 250px; vertical-align: middle">
                  조회 결과가 존재하지 않습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row mt-2" v-if="slideIdx == 1">
      <div
        v-for="(keywordType, kIdx) in chartData.slice(0, 2)"
        :key="kIdx"
        class="col-12 col-md-6"
      >
        <div class="text-center my-3">
          <span
            class="card-title fw-bolder px-3 py-1"
            :class="{
              'text-positive': keywordType.key_code > 0,
              'text-negative': keywordType.key_code < 0,
            }"
          >
            {{ keywordType.label }} 키워드
          </span>
        </div>
        <div class="pe-0 pe-sm-1">
          <table
            class="table table-striped-odd mb-0"
            :class="{
              'striped-positive': keywordType.key_code > 0,
              'striped-negative': keywordType.key_code < 0,
            }"
          >
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th class="">순위</th>
                <th>키워드</th>
                <th>언급량</th>
              </tr>
            </thead>

            <tbody>
              <template
                v-if="cafe_chart[`${keywordType.key}_keyword_rank`]?.length"
              >
                <tr
                  v-for="(keywordRank, index) in cafe_chart[
                    `${keywordType.key}_keyword_rank`
                  ]"
                  :key="index"
                  class="rank-list-content"
                  :class="{
                    active:
                      keywordType.key_code == keywordTop10.type &&
                      index == keywordTop10.activeItemIdx,
                  }"
                  @click="
                    handleKeywordRankClick(
                      index,
                      keywordType.key_code,
                      keywordRank.keyword
                    )
                  "
                >
                  <td class="font-size-12">
                    {{ index + 1 }}
                  </td>
                  <td class="font-size-12 fw-bolder">
                    {{ keywordRank.keyword }}
                  </td>
                  <td class="font-size-12">
                    {{ Number(keywordRank.count).toLocaleString() }}
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="3" style="height: 250px; vertical-align: middle">
                  조회 결과가 존재하지 않습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <CommonLoading v-if="currentLoading" />
  <KeywordRankNewsModal
    v-if="keywordTop10.showDialog"
    :type="keywordTop10.type"
    :news-list="keywordTop10.activeNews"
    @close="initKeywordTop10"
    @more="openNewTab(keywordTop10.searchParam)"
  />
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";

import CommonLoading from "@/components/common/CommonLoading.vue";
import DailyChart from "@/components/analyze/DailyChart.vue";
import DonutChart from "@/components/analyze/DonutChart.vue";
import KeywordRankNewsModal from "@/components/analyze/KeywordRankNewsModal.vue";

import { useCommonStore } from "@/store/common";

import { KeywordAPI } from "@/api/keyword";
import moment from "moment";
import { NewListItem } from "@/models/scrap";

const { loading, hideLoading } = useCommonStore();
const slideIdx = ref(0);
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  groupNo: {
    type: String || Number,
    default: "",
    required: true,
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  keywordList: {
    type: Array,
    default: () => [] as string[],
  },
});

const currentLoading = ref(false);

const keywordTop10 = reactive({
  showDialog: false, // 기사 표시할 다이얼로그
  type: 0, // 긍정 : 1|| 부정: -1
  searchParam: undefined as any, // 키워드
  activeItemIdx: -1, // 긍부정 선택 row Index
  activeNews: [] as NewListItem[], // 미디어 및 기자 순위 관련기사
});

watch(
  () => loading.value,
  (newVal, prevVal) => {
    if (newVal && !prevVal) {
      if (props.groupNo) {
        currentLoading.value = true;
        Promise.all([fetchTrendAnalysis()]).finally(() => {
          currentLoading.value = false;
        });
      }
      // 바로 바뀌면 Tab 중에서 부분 인식 되는 경우 있음
      setTimeout(() => {
        hideLoading();
      }, 300);
    }
  }
);

const chartData = [
  {
    label: "긍정",
    key: "sympathy",
    key_code: 1,
    type: "line",
  },
  {
    label: "부정",
    key: "non_sympathy",
    key_code: -1,
    type: "line",
  },
  {
    label: "중립",
    key: "neutrality",
    key_code: 0,
    type: "line",
  },
];
const platformType = [
  {
    label: "블로그",
    key: "blog",
    color: "#70c6e2",
  },
  {
    label: "카페",
    key: "cafe",
    color: "#74c94b",
  },
];
const daily_nlp_series = ref<any[]>([]);
const daily_nlp_xAxis = ref<string[]>([]);

const daily_nlp = computed(() => {
  return {
    xAxis: daily_nlp_xAxis.value,
    series: daily_nlp_series.value,
    legend: platformType.map((item) => item.label),
  };
});

const total_chart = reactive({
  series: null as any,
});
const blog_chart = reactive({
  total: 0,
  sympathy: 0,
  non_sympathy: 0,
  neutrality: 0,
  series: null as any,
  sympathy_keyword_rank: [] as any[],
  non_sympathy_keyword_rank: [] as any[],
  daily_nlp: {
    xAxis: [] as any[],
    series: [] as any[],
  },
});

const cafe_chart = reactive({
  total: 0,
  sympathy: 0,
  non_sympathy: 0,
  neutrality: 0,
  series: null as any,
  rank_sympathy: [] as any[],
  rank_non_sympathy: [] as any[],
  sympathy_keyword_rank: [] as any[],
  non_sympathy_keyword_rank: [] as any[],
  daily_nlp: {
    xAxis: [] as any[],
    series: [] as any[],
    legend: platformType.map((item) => item.label),
  },
});

/**@description: 추가 뉴스 분석 데이터 조회 */
const fetchTrendAnalysis = async () => {
  // 초기화 ----------------
  slideIdx.value = 0;

  daily_nlp_series.value = [];
  daily_nlp_xAxis.value = [];

  blog_chart.total = 0;
  blog_chart.series = null;
  blog_chart.sympathy_keyword_rank = [];
  blog_chart.non_sympathy_keyword_rank = [];
  blog_chart.daily_nlp.series = [];

  cafe_chart.total = 0;
  cafe_chart.series = null;
  cafe_chart.sympathy_keyword_rank = [];
  cafe_chart.non_sympathy_keyword_rank = [];
  cafe_chart.daily_nlp.series = [];

  total_chart.series = null;

  keywordTop10.showDialog = false;
  keywordTop10.activeItemIdx = -1;
  keywordTop10.searchParam = undefined;
  keywordTop10.activeNews = [];
  // 초기화 End ----------------

  const res = await KeywordAPI.fetchTrendAnalysis(
    props.groupNo,
    props.keywordList as string[],
    props.startDate,
    props.endDate
  );

  if (res.result) {
    const { blog_total_count, cafe_total_count } = res;
    const {
      daily_blog,
      daily_cafe,
      blog_sympathy_keyword_rank,
      blog_non_sympathy_keyword_rank,
      cafe_sympathy_keyword_rank,
      cafe_non_sympathy_keyword_rank,
    } = res.data;

    // 채널 호감도 집계 원형 차트
    blog_chart.total = blog_total_count ?? 0;
    cafe_chart.total = cafe_total_count ?? 0;

    // 긍 부정 차트
    blog_chart.sympathy_keyword_rank = blog_sympathy_keyword_rank
      ? [...blog_sympathy_keyword_rank]
      : [];
    blog_chart.non_sympathy_keyword_rank =
      [...blog_non_sympathy_keyword_rank] ?? [];
    cafe_chart.sympathy_keyword_rank = cafe_sympathy_keyword_rank
      ? [...cafe_sympathy_keyword_rank]
      : [];
    cafe_chart.non_sympathy_keyword_rank = cafe_non_sympathy_keyword_rank
      ? [...cafe_non_sympathy_keyword_rank]
      : [];

    const blog_chart_temp: any[] = [];
    const cafe_chart_temp: any[] = [];
    const total_chart_temp: any[] = [];

    chartData.map((chartDataType: any) => {
      let totVal = 0;
      if (blog_total_count) {
        let cVal = res[`blog_${chartDataType.key}`] ?? 0;
        (blog_chart as any)[`${chartDataType.key}`] = cVal;
        totVal += cVal;
        blog_chart_temp.push({
          name: chartDataType.label,
          value: cVal,
        });
      }

      if (cafe_total_count) {
        let cVal = res[`cafe_${chartDataType.key}`] ?? 0;
        (cafe_chart as any)[`${chartDataType.key}`] = cVal;
        totVal += cVal;
        cafe_chart_temp.push({
          name: chartDataType.label,
          value: cVal,
        });
      }

      total_chart_temp.push({
        name: chartDataType.label,
        value: totVal,
      });
    });

    blog_chart.series = [...blog_chart_temp];
    cafe_chart.series = [...cafe_chart_temp];
    total_chart.series = [...total_chart_temp];

    // --start ~ end day Array List-----
    const stDate = moment(props.startDate);
    const nDays = moment(props.endDate).diff(stDate, "days") + 1;
    const dayArr = [...Array(nDays).keys()];

    platformType.map((platform) => {
      daily_nlp_series.value.push({
        name: platform.label,
        type: "line",
        key: platform.key,
        data: [] as any[],
        color: platform.color,
      });
    });
    // daily_nlp_xAxis.value = [];

    // 조회 기간별  데이터 맵핑
    dayArr.map((i: number) => {
      const day = stDate.clone().add(i, "d").format("YYYY-MM-DD");
      daily_nlp_xAxis.value.push(day);
      const bdIdx =
        daily_blog?.findIndex((dayData: any) => dayData.date == day) ?? -1;
      const cdIdx =
        daily_cafe?.findIndex((dayData: any) => dayData.date == day) ?? -1;

      daily_nlp_series.value[0].data.push(
        bdIdx < 0 ? 0 : daily_blog[bdIdx].count
      );
      daily_nlp_series.value[1].data.push(
        cdIdx < 0 ? 0 : daily_cafe[cdIdx].count
      );
    });
  }
};

/**@description: 긍/부정 순위 row 클릭 */
const handleKeywordRankClick = async (
  itemIdx: number,
  type: number,
  keyword: string
) => {
  if (keywordTop10.activeItemIdx == itemIdx) return;

  keywordTop10.type = type;
  keywordTop10.activeItemIdx = itemIdx;
  keywordTop10.activeNews = [];
  keywordTop10.searchParam = {
    nlp_score: [type],
    nlp_keyword: [keyword],
  };
  const response = await gethNewsByKeyword(keywordTop10.searchParam, 10);
  keywordTop10.activeNews = response;

  keywordTop10.showDialog = true;
};

const initKeywordTop10 = () => {
  keywordTop10.showDialog = false;
  keywordTop10.type = 0;
  keywordTop10.activeItemIdx = -1;
  keywordTop10.activeNews = [];
};

/**@description: 기사 조회  */
const gethNewsByKeyword = async (searchParams: any, limit = 5) => {
  const response = await KeywordAPI.fetchScrapKeyWord({
    ...searchParams,
    keyword_no: props.keywordList,
    start_date: props.startDate,
    end_date: props.endDate,
    limit: limit,
  });

  const { newslist } = response?.data ?? [];

  return newslist && newslist.length
    ? newslist.map(
        (item: any) =>
          new NewListItem({
            ...item,
            keyword: decodeURIComponent(item.keyword),
          })
      )
    : [];
};

/**@description: 더보기  */
const openNewTab = (searchParams: any) => {
  window.open(
    `/monitoring?groupNo=${props.groupNo}&searchParams=${JSON.stringify({
      ...searchParams,
      keyword_no: props.keywordList,
      start_date: props.startDate,
      end_date: props.endDate,
    })}`
  );
};

if (props.groupNo) {
  currentLoading.value = true;

  Promise.all([fetchTrendAnalysis()]).finally(() => {
    currentLoading.value = false;
    hideLoading();
  });
}
</script>

<style lang="scss" scoped>
$gray: #74788d;
$primary: #556ee6;

.trend-chart-wrap {
  .card {
    &:hover {
      cursor: pointer;
      filter: opacity(50%);
      border: 2px solid rgba($primary, 0.7) !important;
    }
    &.active {
      border: 2px solid rgba($primary, 0.3);
      .fw-bolder {
        color: $primary;
        background-color: rgba($primary, 0.1);
      }
    }
  }
}
.no-data {
  width: 100%;
  min-height: 200px;
  background-color: rgba($primary, 0.1);
  h4 {
    color: rgba($primary, 0.6);
    font-weight: bolder;
    font-size: 17px;
  }
}

.card-body .border {
  border: 1px solid #a6b0cf !important;
  border-radius: 0.5rem;
}

table tbody,
.table-striped-odd {
  tbody {
    tr {
      &:nth-child(odd) {
        background-color: rgba($gray, 0.03) !important;
        --bs-table-accent-bg: rgba($gray, 0.03) !important;
        td {
          background-color: rgba($gray, 0.03) !important;
        }
      }

      &.active,
      &:hover {
        background-color: rgba($gray, 0.1) !important;
        --bs-table-accent-bg: rgba($gray, 0.1) !important;
        cursor: pointer;

        td {
          background-color: rgba($gray, 0.1) !important;
        }
        font-weight: 600;
      }
    }
  }

  &.striped-positive {
    /** 긍정 **/
    $table-active-color: #5ccfa4;

    tbody {
      tr {
        &:nth-child(odd) {
          background-color: rgba($table-active-color, 0.03) !important;
          --bs-table-accent-bg: rgba($table-active-color, 0.03) !important;
          td {
            background-color: rgba($table-active-color, 0.03) !important;
          }
        }

        &.active,
        &:hover {
          background-color: rgba($table-active-color, 0.1) !important;
          --bs-table-accent-bg: rgba($table-active-color, 0.1) !important;
          cursor: pointer;

          td {
            background-color: rgba($table-active-color, 0.1) !important;
          }
          color: rgba($table-active-color, 0.8) !important;
          font-weight: 600;
        }
      }
    }
  }

  &.striped-negative {
    /** 부정 **/
    $table-active-color: #f68887;

    tbody {
      tr {
        &:nth-child(odd) {
          background-color: rgba($table-active-color, 0.03) !important;
          --bs-table-accent-bg: rgba($table-active-color, 0.03) !important;
          td {
            background-color: rgba($table-active-color, 0.03) !important;
          }
        }

        &.active,
        &:hover {
          background-color: rgba($table-active-color, 0.1) !important;
          --bs-table-accent-bg: rgba($table-active-color, 0.1) !important;
          cursor: pointer;

          td {
            background-color: rgba($table-active-color, 0.1) !important;
          }
          color: rgba($table-active-color, 0.8) !important;
          font-weight: 600;
        }
      }
    }
  }
}
.btn-group {
  button {
    max-width: 80px;
  }
}
.rank_news_warp {
  border-radius: 8px;
  background-color: rgba($gray, 0.1);
  padding: 8px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  overflow: hidden;
  .card-body {
    height: 450px;
    overflow-y: auto;
    padding: 4px;
    padding-left: 8px !important;
    padding-right: 8px !important;

    &::-webkit-scrollbar {
      width: 4px;
      padding-top: 10px;
      background-color: rgba($gray, 0.2);
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      width: 4px;
      background-color: $gray;
    }
  }
}
</style>
