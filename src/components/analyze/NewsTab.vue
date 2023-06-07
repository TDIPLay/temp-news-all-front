<template>
  <div class="row g-1 g-md-2">
    <div class="col-md-4 card mb-1">
      <div class="card-box border p-3 py-md-4 py-3 d-flex align-items-center">
        <h3 class="card-title text-start col">총 발행된 뉴스</h3>

        <h3 class="font-size-13 fw-bold col-lg-auto">
          {{ newsRankInfo.totalCount.toLocaleString() }}
          <span class="font-size-13">건</span>
        </h3>
      </div>
    </div>

    <div class="col-md-4 card mb-1">
      <div class="card-box border p-3 py-md-4 py-3 d-flex align-items-center">
        <h3 class="card-title text-start col">발행 미디어</h3>

        <h3 class="font-size-13 fw-bold col-lg-auto">
          {{ newsRankInfo.pressCount.toLocaleString() }}
          <span class="font-size-13">개</span>
        </h3>
      </div>
    </div>

    <div class="col-md-4 card mb-1">
      <div class="card-box border p-3 py-md-4 py-3 d-flex align-items-center">
        <h3 class="card-title text-start col">발행 기자</h3>

        <h3 class="font-size-13 fw-bold col-lg-auto">
          {{ newsRankInfo.reporterCount.toLocaleString() }}
          <span class="font-size-13">명</span>
        </h3>
      </div>
    </div>
  </div>

  <div class="py-3">
    <div class="card-title-index card-title text-start">뉴스 집계</div>
    <template v-if="dailyCahrtData">
      <DailyChart
        :is-active="props.isActive"
        :data="dailyCahrtData"
        :id="'dailyCahrtData'"
        :toolbox="['line', 'bar', 'stack']"
      />
    </template>
    <div
      v-else
      class="no-data d-flex align-items-center justify-content-center"
    >
      <h4 class="card-title">조회중입니다.</h4>
    </div>
  </div>

  <div class="py-3">
    <div class="card-title-index card-title text-start">기간별 종합 반응</div>
    <template v-if="newsRankInfo.daily_nlp">
      <DailyChart
        :is-active="props.isActive"
        :data="newsRankInfo.daily_nlp"
        :id="'dailyCahrtData'"
        :toolbox="['line', 'bar', 'stack']"
      />
    </template>
    <div
      v-else
      class="no-data d-flex align-items-center justify-content-center"
    >
      <h4 class="card-title">조회중입니다.</h4>
    </div>

    <div class="card-title-index card-title text-start mt-3">
      기사 및 댓글 반응
    </div>
    <div v-if="newsRankInfo.news_circle" class="d-flex">
      <div class="col">
        <DonutChart
          :is-active="props.isActive"
          :data="newsRankInfo.news_circle"
          id="circleChart1"
        />
        <div class="fw-bolder py-3">전체 기사</div>
      </div>
      <div class="col">
        <DonutChart
          :is-active="props.isActive"
          :data="newsRankInfo.news_reply_circle"
          id="circleChart2"
        />
        <div class="fw-bolder py-3">전체 댓글</div>
      </div>
    </div>
  </div>

  <div class="py-3 mb-2">
    <div class="card-title-index card-title text-start">
      긍부정 키워드 Top 10
    </div>

    <div class="row mt-2">
      <div
        v-for="(keywordType, kIdx) in chartData.slice(0, 2)"
        :key="kIdx"
        class="col-12 col-md-6"
      >
        <div class="text-center">
          <span
            class="badge font-size-13 fw-bolder px-3 py-1 mb-3"
            :class="{
              'badge-soft-success': keywordType.key_code > 0,
              'badge-soft-danger': keywordType.key_code < 0,
            }"
          >
            {{ keywordType.label }} 키워드
          </span>
        </div>
        <div class="pe-0 pe-sm-1 table-responsive">
          <table class="table table-striped-odd mb-0">
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th class="">순위</th>
                <th>키워드</th>
                <th>언급량</th>
              </tr>
            </thead>

            <tbody>
              <template
                v-if="newsRankInfo[`${keywordType.key}_keyword_rank`]?.length"
              >
                <tr
                  v-for="(keywordRank, index) in newsRankInfo[
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
                  <td class="font-size-13">
                    {{ index + 1 }}
                  </td>
                  <td class="font-size-13 fw-bolder">
                    {{ keywordRank.keyword }}
                  </td>
                  <td class="font-size-13">
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

  <div class="py-3 row">
    <div class="col-12 col-md-5 text-start">
      <div class="card-title text-start d-flex">
        <div class="card-title-index card-title col me-3 my-1">
          미디어 및 기자 순위
        </div>
        <div class="col btn-group btn-group-sm ms-auto" role="group">
          <button
            type="button"
            class="btn ms-auto"
            @click="
              () => {
                rankTop10.activeTabIdx = 0;
                rankTop10.activeItemIdx = -1;
                handleRankClick(0, { in_press_no: [rankTabData[0].id] });
              }
            "
            :class="{
              'btn-primary': !rankTop10.activeTabIdx,
              'btn-outline-primary': !!rankTop10.activeTabIdx,
            }"
          >
            미디어
          </button>
          <button
            type="button"
            class="btn"
            @click="
              () => {
                rankTop10.activeTabIdx = 1;
                rankTop10.activeItemIdx = -1;
                rankTop10.searchParam = undefined;
                handleRankClick(0, { repoter: [rankTabData[0].id] });
              }
            "
            :class="{
              'btn-primary': !!rankTop10.activeTabIdx,
              'btn-outline-primary': !rankTop10.activeTabIdx,
            }"
          >
            기자
          </button>
        </div>
      </div>

      <div class="pe-0 pe-sm-1 d-flex table-responsive">
        <table class="table mb-0 col">
          <thead>
            <tr style="border-bottom: 3px solid #eff2f7">
              <th class="px-1 text-center" style="width: 40px">순위</th>
              <th>{{ rankTop10.activeTabIdx == 0 ? "미디어" : "기자" }} 명</th>
              <th class="text-center" style="width: 100px">발행 수</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(rankData, index) in rankTabData"
              :key="index"
              class="rank-list-content"
              :class="{
                active: rankTop10.activeItemIdx == index,
              }"
              @click="rankData.clickEvt()"
            >
              <td class="px-auto fw-bolder text-center" style="width: 40px">
                {{ index + 1 }}
              </td>
              <td class="text-start fw-bolder d-flex">
                <img
                  v-if="rankData.url"
                  :src="rankData.url"
                  class="me-2 col-auto"
                  style="max-height: 11px; max-width: 50px"
                />
                <span
                  v-else-if="rankData.press_name"
                  class="me-2 col-auto badge badge-soft-dark"
                >
                  {{ rankData.press_name }}
                </span>

                <span
                  class="overflow-text col"
                  style="width: inherit; max-width: 70%"
                >
                  {{ rankData.name }}
                </span>
              </td>
              <td class="text-center" style="width: 100px">
                {{
                  rankData.count ? Number(rankData.count).toLocaleString() : 0
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-12 col-md-7 mt-3 mt-md-0">
      <div class="rank_news_warp ps-0 ps-md-1">
        <div class="d-flex text-start p-1 ps-3">
          <span class="col font-size-15 fw-bolder pb-2"> 관련 기사 </span>

          <span
            class="col-auto font-size-13 fw-bolder pb-2 px-3 pointor"
            @click="openNewTab(rankTop10.searchParam)"
          >
            <i class="mdi mdi-plus"></i>
            더보기
          </span>
        </div>

        <div class="card-body">
          <template v-if="rankTop10.activeNews?.length">
            <SemiCardItem
              v-for="(news, index) in rankTop10.activeNews"
              :key="index"
              :index="index"
              :news-data="news"
              :id="news.news_no"
            />
          </template>
          <div
            v-else
            class="card-title d-flex align-items-center justify-content-center w-100 m-0"
            style="height: 100%"
          >
            조회결과가 존재하지 않습니다.
          </div>
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
import SemiCardItem from "@/components/analyze/SemiCardItem.vue";

import { useCommonStore } from "@/store/common";

import { KeywordAPI } from "@/api/keyword";
import moment from "moment";
import { NewListItem } from "@/models/scrap";
import { useRouter } from "vue-router";

const { loading, hideLoading } = useCommonStore();
const router = useRouter();
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
const rankTop10 = reactive({
  activeTabIdx: 0,
  activeItemIdx: -1, // 미디어 및 기자 순위 클릭 인덱스
  searchParam: undefined as any, //
  activeNews: [] as NewListItem[], // 미디어 및 기자 순위 관련기사
});
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

        Promise.all([fetchNewsAnalysis()]).finally(() => {
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
    color: "#34c38f",
  },
  {
    label: "부정",
    key: "non_sympathy",
    key_code: -1,
    type: "line",
    color: "#f46a6a",
  },
  {
    label: "중립",
    key: "neutrality",
    key_code: 0,
    type: "line",
    color: "#f1b44c",
  },
];

const dailyCahrtSeries = [
  {
    label: "발행된 뉴스",
    key: "news",
    type: "line",
  },
  {
    label: "발행 미디어",
    key: "press",
    type: "line",
  },
  {
    label: "발행 기자",
    key: "repoter",
    type: "line",
  },
];
const daily_xAxis = ref<string[]>([]);
const daily_series = ref<any[]>([]);
// 팅서치에 표시하는 값
const newsRankInfo = reactive<{
  totalCount: number;
  pressCount: number;
  reporterCount: number;
  daily: any[];
  daily_press: any[];
  daily_repoter: any[];
  press: any[];
  repoter: any[];

  // ++++++++++
  daily_nlp: any;
  news_circle: any;
  news_reply_circle: any;
  sympathy_keyword_rank: any[];
  non_sympathy_keyword_rank: any[];
}>({
  totalCount: 0,
  pressCount: 0,
  reporterCount: 0,
  daily: [],
  daily_press: [],
  daily_repoter: [],
  press: [],
  repoter: [],
  // ++++++++++
  daily_nlp: null,
  news_circle: null,
  news_reply_circle: null,
  sympathy_keyword_rank: [],
  non_sympathy_keyword_rank: [],
});
// 미디어 및 기자 순위 데이터
const rankTabData = computed(() => {
  return rankTop10.activeTabIdx == 0
    ? newsRankInfo.press
    : newsRankInfo.repoter;
});

const dailyCahrtData = computed(() => {
  if (!newsRankInfo.daily.length || currentLoading.value) return null;

  return {
    xAxis: daily_xAxis.value,
    series: daily_series.value,
    legend: dailyCahrtSeries.map((item) => item.label),
  };
});

/**@description: 추가 뉴스 분석 데이터 조회 */
const fetchNewsAnalysis = async () => {
  const res = await KeywordAPI.fetchNewsAnalysis(
    props.groupNo,
    props.keywordList as string[],
    props.startDate,
    props.endDate
  );

  if (res.result) {
    const {
      daily_news,
      press_rank,
      repoter,
      daily_nlp,
      sympathy_keyword_rank,
      non_sympathy_keyword_rank,
    } = res.data;

    // 뉴스 집계
    newsRankInfo.totalCount = res.news_total_count ?? 0;
    newsRankInfo.pressCount = res.press_total_count ?? 0;
    newsRankInfo.reporterCount = res.repoter_total_count ?? 0;

    newsRankInfo.daily =
      daily_news?.sort((a: any, b: any) => b.date > a.date) ?? [];
    // 미디어 & 기자 순위
    newsRankInfo.press =
      press_rank?.map((item: any, idx: number) => ({
        id: item.press_no,
        name: item.press_name,
        count: item.count,
        url: item.img_url,
        clickEvt: () => handleRankClick(idx, { in_press_no: [item.press_no] }),
      })) ?? [];
    newsRankInfo.repoter =
      repoter?.map((item: any, idx: number) => ({
        id: item.repoter_name,
        name: item.repoter_name,
        count: item.count,
        press_name: item.press_name,
        url: item.img_url,
        clickEvt: () => handleRankClick(idx, { repoter: [item.repoter_name] }),
      })) ?? [];

    // 관련기사 초기화 및 세팅
    rankTop10.activeTabIdx = 0;
    rankTop10.activeItemIdx = -1;

    if (newsRankInfo.press.length) {
      newsRankInfo.press[0].clickEvt();
    }

    // --start ~ end day Array List-----
    const stDate = moment(props.startDate);
    const nDays = moment(props.endDate).diff(stDate, "days") + 1;
    const dayArr = [...Array(nDays).keys()];

    // 기간별 종합 반응
    newsRankInfo.daily_nlp = {
      xAxis: [] as any[],
      series: [] as any[],
      legend: [] as string[],
    };
    // 기사 및 댓글반응 원형차트 데이터
    newsRankInfo.news_circle = {
      series: [] as any[], // 값
      legend: [] as any[], // 라벨
    };
    // 댓글 반응 도넛 차트 데이터
    newsRankInfo.news_reply_circle = {
      series: [
        { name: "긍정", value: res.reply_sympathy_sum ?? 0 },
        { name: "부정", value: res.reply_non_sympathy_sum ?? 0 },
      ], // 값
      legend: ["긍정", "부정"] as any[], // 라벨
    };

    chartData.map((chartDataType) => {
      newsRankInfo.daily_nlp.legend.push(chartDataType.label);

      newsRankInfo.news_circle.series.push({
        name: chartDataType.label,
        value: res[chartDataType.key] ?? 0,
      });
      newsRankInfo.daily_nlp.series.push({
        name: chartDataType.label,
        type: chartDataType.type,
        key: chartDataType.key,
        data: [] as any[],
        itemStyle: {
          color: chartDataType.color,
        },
      });
    });

    newsRankInfo.news_circle.legend = [...newsRankInfo.daily_nlp.legend];

    daily_series.value = [];
    daily_xAxis.value = [];

    // 발행된 뉴스& 미디어 & 기자 차트
    dailyCahrtSeries.map((series) => {
      daily_series.value.push({
        name: series.label,
        type: "line",
        key: series.key,
        data: [] as any[],
      });
    });

    // 조회 기간별  데이터 맵핑
    dayArr.map((i: number) => {
      const day = stDate.clone().add(i, "d").format("YYYY-MM-DD");
      daily_xAxis.value.push(day);
      const dIdx =
        daily_nlp?.findIndex((dayData: any) => dayData.date == day) ?? -1;

      // 발행된 뉴스& 미디어 & 기자 차트
      dailyCahrtSeries.map((series, idx) => {
        let dIdx =
          res.data[`daily_${series.key}`]?.findIndex(
            (dayData: any) => dayData.date == day
          ) ?? -1;

        daily_series.value[idx].data.push(
          dIdx < 0 ? 0 : res.data[`daily_${series.key}`][dIdx].count
        );
      });

      chartData.map((chartDataType) => {
        const sIdx =
          newsRankInfo?.daily_nlp?.series?.findIndex(
            (chartS: any) => chartS.key === chartDataType.key
          ) ?? -1;

        if (sIdx > -1) {
          newsRankInfo.daily_nlp.series[sIdx].data.push(
            dIdx < 0 ? 0 : daily_nlp[dIdx][chartDataType.key]
          );
        }
      });
    });

    newsRankInfo.daily_nlp.xAxis = daily_xAxis.value;

    // 긍정 키워드 Top10
    newsRankInfo.sympathy_keyword_rank = sympathy_keyword_rank;
    // 부정 키워드 Top10
    newsRankInfo.non_sympathy_keyword_rank = non_sympathy_keyword_rank;
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

/**@description: 미디어, 기자 순위 row 클릭 */
const handleRankClick = async (itemIdx: number, searchParams: any) => {
  if (rankTop10.activeItemIdx == itemIdx) return;
  // repoter: ["오종탁"]  in_press_no:[1,2]
  rankTop10.activeNews = [];
  rankTop10.activeItemIdx = itemIdx;
  rankTop10.searchParam = searchParams;

  const response = await gethNewsByKeyword(searchParams);
  rankTop10.activeNews = response;
};

/**@description: 기사 조회  */
const gethNewsByKeyword = async (searchParams: any, limit = 5) => {
  // repoter: ["오종탁"], nlp_keyword: ["빕스", "제일제당"]

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

  Promise.all([fetchNewsAnalysis()]).finally(() => {
    currentLoading.value = false;
    hideLoading();
  });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$gray: #74788d;
$primary: #556ee6;
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
.table-striped-odd > tbody {
  tr:hover,
  tr.active {
    background-color: gba($primary, 0.1) !important;
    --bs-table-accent-bg: gba($primary, 0.1) !important;
    cursor: pointer;

    td {
      background-color: rgba($primary, 0.1) !important;
    }
  }

  tr.active {
    color: rgba($primary, 0.8) !important;
    font-weight: 600;
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

  .pointor:hover {
    color: $primary;
    cursor: pointer;
  }
  .card-body {
    height: 460px;
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
