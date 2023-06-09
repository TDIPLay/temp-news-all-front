<template>
  <div class="py-3">
    <div class="card-title-index card-title text-start">키워드별 차트</div>
    <template v-if="newsRankInfo.daily_keywords && !currentLoading">
      <DailyChart
        :is-active="props.isActive"
        :data="newsRankInfo.daily_keywords"
        :id="'dailyKeywordCahrtData'"
      />
    </template>
    <div
      v-else
      class="no-data d-flex align-items-center justify-content-center"
    >
      <h4 class="card-title">조회중입니다.</h4>
    </div>
  </div>

  <div class="py-3 mb-2">
    <div class="card-title-index card-title text-start">경쟁력</div>

    <div class="row">
      <div class="col-12 col-md-6">
        <div class="text-center">
          <span
            class="badge badge-soft-primary font-size-13 fw-bolder px-3 py-1 mb-3"
          >
            검색량
          </span>
        </div>
        <div class="pe-0 pe-sm-1 table-responsive">
          <table class="table table-striped mb-0">
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th class="">키워드</th>
                <th>모바일</th>
                <th>PC</th>
                <th>합계</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(competition, index) in newsRankInfo.competition"
                :key="index"
                class="rank-list-content"
              >
                <td class="font-size-13 fw-bolder">
                  {{ competition.keyword }}
                </td>
                <td class="font-size-13">
                  {{ Number(competition.mobileCount).toLocaleString() }}
                </td>
                <td class="font-size-13">
                  {{ Number(competition.pcCount).toLocaleString() }}
                </td>
                <td class="font-size-13">
                  {{ competition.totalCount.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-12 col-md-6 mt-3 mt-md-0">
        <div class="text-center">
          <span
            class="badge badge-soft-primary font-size-13 fw-bolder px-3 py-1 mb-3"
          >
            누적 콘텐츠발행량
          </span>
        </div>
        <div class="ps-0 ps-md-1 table-responsive">
          <table class="table table-striped mb-0">
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th>키워드</th>
                <th>뉴스</th>
                <th>블로그</th>
                <th>카페</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(competition, index) in newsRankInfo.competition"
                :key="index"
                class="rank-list-content"
              >
                <td class="font-size-13 fw-bolder">
                  {{ competition.keyword }}
                </td>
                <td class="font-size-13">
                  {{ competition.newsCount.toLocaleString() }}
                </td>
                <td class="font-size-13">
                  {{ competition.blogCount.toLocaleString() }}
                </td>

                <td class="font-size-13">
                  {{ competition.cafeCount.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="py-3">
    <div class="card-title-index card-title text-start">인구 통계</div>

    <div class="row">
      <div class="col-12 col-md-6">
        <div class="text-center">
          <span
            class="badge badge-soft-primary font-size-13 fw-bolder px-3 py-1 mb-3"
          >
            성별
          </span>
        </div>
        <div class="pe-0 pe-sm-1 table-responsive">
          <table class="table table-striped mb-0">
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th class="">키워드</th>
                <th>남성</th>
                <th>여성</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(competition, index) in newsRankInfo.competition"
                :key="index"
                class="rank-list-content"
              >
                <td class="font-size-13 fw-bolder">
                  {{ competition.keyword }}
                </td>
                <td class="font-size-13">
                  {{
                    competition.male
                      ? Number(competition.male).toLocaleString()
                      : 0
                  }}%
                </td>
                <td class="font-size-13">
                  {{
                    competition.female
                      ? Number(competition.female).toLocaleString()
                      : 0
                  }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-12 col-md-6 mt-3 mt-md-0">
        <div class="text-center">
          <span
            class="badge badge-soft-primary font-size-13 fw-bolder px-3 py-1 mb-3"
          >
            연령
          </span>
        </div>
        <div class="ps-0 ps-md-1 table-responsive">
          <table class="table table-striped mb-0">
            <thead>
              <tr style="border-bottom: 3px solid #eff2f7">
                <th>키워드</th>
                <th>10대</th>
                <th>20대</th>
                <th>30대</th>
                <th>40대</th>
                <th>50대</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(competition, index) in newsRankInfo.competition"
                :key="index"
                class="rank-list-content"
              >
                <th>{{ competition.keyword }}</th>
                <td>
                  {{
                    competition.age_10
                      ? Number(competition.age_10).toLocaleString()
                      : 0
                  }}%
                </td>
                <td>
                  {{
                    competition.age_20
                      ? Number(competition.age_20).toLocaleString()
                      : 0
                  }}%
                </td>
                <td>
                  {{
                    competition.age_30
                      ? Number(competition.age_30).toLocaleString()
                      : 0
                  }}%
                </td>
                <td>
                  {{
                    competition.age_40
                      ? Number(competition.age_40).toLocaleString()
                      : 0
                  }}%
                </td>
                <td>
                  {{
                    competition.age_50
                      ? Number(competition.age_50).toLocaleString()
                      : 0
                  }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <CommonLoading v-if="currentLoading" />
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";

import CommonLoading from "@/components/common/CommonLoading.vue";
import DailyChart from "@/components/analyze/DailyChart.vue";

import { useCommonStore } from "@/store/common";

import { KeywordAPI } from "@/api/keyword";

const { loading, hideLoading } = useCommonStore();

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

watch(
  () => loading.value,
  (newVal, prevVal) => {
    if (newVal && !prevVal) {
      if (props.groupNo) {
        currentLoading.value = true;
        Promise.all([fetchNewsRankTingSearch()]).finally(() => {
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

// 팅서치에 표시하는 값
const newsRankInfo = reactive<{
  competition: any[];
  chart_tablelist: any[];
  daily_keywords?: any;
}>({
  daily_keywords: null,
  competition: [],
  chart_tablelist: [],
});

/**@description: 팅서치에 표시하는 내용 가지고 오기 */
const fetchNewsRankTingSearch = async () => {
  let query = "";

  newsRankInfo.daily_keywords = null;
  newsRankInfo.competition = [];
  newsRankInfo.chart_tablelist = [];

  props.keywordList.map((item, index) => {
    query += `${index ? "&" : ""}query=${item}`;
  });
  if (props.startDate) {
    query += `&startDate=${props.startDate}`;
  }
  if (props.endDate) {
    query += `&endDate=${props.endDate}`;
  }

  const res = await KeywordAPI.fetchTrand(query);

  if (res.result) {
    const chartData = res.data;

    if (chartData.length > 0) {
      let legend: any[] = [];
      let series: any[] = [];
      let xAxis: any[] = [];
      let temp: any[] = [];

      chartData.map((keywordOv: any, index: number) => {
        if (!index) {
          xAxis = keywordOv.daily.map((item: any, dIdx: number) => {
            return item.period;
          });
        } else {
          keywordOv.daily.map((item: any, dIdx: number) => {});
        }

        series.push({
          name: keywordOv.title,
          type: "line",
          data: keywordOv.daily.map((item: any) => {
            return item.totalCount;
          }),
        });

        legend.push(keywordOv.title);

        newsRankInfo.competition.push({
          keyword: keywordOv.title,
          mobileCount: Number(keywordOv.mobileCount),
          pcCount: keywordOv.pcCount,
          totalCount: Number(keywordOv.pcCount) + Number(keywordOv.mobileCount),
          blogCount: Number(keywordOv.blogCount),
          newsCount: Number(keywordOv.newsCount),
          cafeCount: Number(keywordOv.cafeCount),
          ...keywordOv.rate,
        });
        temp.push({
          key: keywordOv.title,
          data: series,
        });
      });

      newsRankInfo.chart_tablelist = temp;
      // 키워드별 발행
      newsRankInfo.daily_keywords = {
        xAxis: xAxis,
        series: series,
        legend: legend,
      };
    }
  }
};

if (props.groupNo) {
  currentLoading.value = true;

  Promise.all([fetchNewsRankTingSearch()]).finally(() => {
    currentLoading.value = false;
    hideLoading();
  });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
</style>
