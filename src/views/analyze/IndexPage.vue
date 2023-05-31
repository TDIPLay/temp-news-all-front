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
          <i
            class="btn bx bx-pencil p-1 m-1 my-auto font-size-20"
            @click="
              () => {
                if (!selectedKeywordGroup || loading) return;
                showKeywordGroupModal.info = true;
              }
            "
          ></i>

          <!-- 키워드 그룹 추가 -->
          <i
            class="btn bx bxs-plus-square p-1 my-auto font-size-20"
            @click="
              () => {
                if (!selectedKeywordGroup || loading) return;
                showKeywordGroupModal.create = true;
              }
            "
          ></i>
        </div>

        <div class="col-12 row justify-content-start pa-0 pb-1 g-1 mt-0">
          <span
            v-for="(keyword, idx) in filteredSelectedKeywords"
            :key="idx"
            class="col-auto badge rounded-pill font-size-11 badge-soft-secondary ms-2"
          >
            {{ keyword.keyword }}
            <i
              class="bx bx-x-circle"
              style="margin-left: 4px"
              @click="
                handleKeywordClick(
                  selectedKeywordGroup.group_no,
                  keyword.keyword_no
                )
              "
            ></i>
          </span>

          <!-- <span @click="addKeywordModal(selectedKeywordGroup.group_no)">키워드 추가</span> -->
        </div>
      </div>

      <div class="card">
        <div class="card-body"></div>
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import PageHeader from "@/components/layouts/page-header.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useCommonStore } from "@/store/common";
import { ScrapKeyword, ScrapKeywordGroup } from "@/models/scrap";
import { KeywordAPI } from "@/api/keyword";

const { loading, showNoti, showLoading, hideLoading } = useCommonStore();

const searchDate = reactive({
  startDate: "",
  endDate: "",
});
const keywordsGroupList = ref<ScrapKeywordGroup[]>([]);
const selectedKeywordGroup = ref<ScrapKeywordGroup>();
const selectedKeywords = ref<ScrapKeyword[]>([]);
// 팅서치에 표시하는 값
const newsRankInfo = reactive({
  totalCount: 0,
  pressCount: 0,
  reporterCount: 0,
  daily: [] as any[],
  press: [] as any[],
  repoter: [] as any[],
  //-----------
  daily_keywords: null,
  competition: [] as any[],
  chart_tablelist: [] as any[],
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
const fetchKeywordGroupList = async (group_no?: string) => {
  const response = await KeywordAPI.getKeyWordGroups();

  const { data } = response;

  if (data && data.length > 0) {
    keywordsGroupList.value = data.map((item) => new ScrapKeywordGroup(item));
  }
};

/**@description: 키워드 그룹 선택시 */
const handleKeywordGroupClick = async (group_no: string) => {
  if (!group_no) return;

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
  selectedKeywords.value = keywordGrooup.keyword_list
    ? [...keywordGrooup.keyword_list]
    : [];

  await Promise.all([
    fetchNewsRank(searchDate),
    fetchNewsRankTingSearch(searchDate),
  ]);
};

/**@description */
const fetchNewsRank = async ({ startDate, endDate }) => {
  searchDate.startDate = startDate;
  searchDate.endDate = endDate;

  // console.log("getCheckItem", selectedKeywordGroup.value, startDate, endDate);
  if (!selectedKeywordGroup.value?.group_no) return;

  showLoading();

  const res = await KeywordAPI.fetchNewsRank(
    selectedKeywordGroup.value.group_no,
    selectedKeywordNoList.value,
    startDate,
    endDate
  );

  if (res.result) {
    const { daily_news, press_rank, repoter } = res.data;

    newsRankInfo.totalCount = res.news_total_count ?? 0;
    newsRankInfo.pressCount = res.press_total_count ?? 0;
    newsRankInfo.reporterCount = res.repoter_total_count ?? 0;
    newsRankInfo.daily = daily_news.sort((a, b) => b.date > a.date) ?? [];
    newsRankInfo.press = press_rank ?? [];
    newsRankInfo.repoter = repoter ?? [];
  }

  hideLoading();
};

/**@description: 팅서치에 표시하는 내용 가지고 오기 */
const fetchNewsRankTingSearch = async ({ startDate, endDate }) => {
  searchDate.startDate = startDate;
  searchDate.endDate = endDate;
  console.log(selectedKeywords.value);
  if (!selectedKeywordGroup.value?.group_no) return;

  // showLoading();
  let query = "";

  newsRankInfo.daily_keywords = null;
  newsRankInfo.competition = [];
  newsRankInfo.chart_tablelist = [];

  selectedKeywordTextList.value.map((item, index) => {
    query += `${index ? "&" : ""}query=${item}`;
  });
  if (startDate) {
    query += `&startDate=${startDate}`;
  }
  if (endDate) {
    query += `&endDate=${endDate}`;
  }

  const res = await KeywordAPI.fetchTrand(query);

  if (res.result) {
    const chartData = res.data;

    if (chartData.length > 0) {
      let legend = [];
      let series = [];
      let xAxis = [];
      let temp = [];

      chartData.map((keywordOv, index) => {
        if (!index) {
          xAxis = keywordOv.daily.map((item, dIdx) => {
            // temp.push({
            //   date: item.period,
            //   value: [item.totalCount],
            // });
            return item.period;
          });
        } else {
          keywordOv.daily.map((item, dIdx) => {
            // temp[dIdx].data.push(item.totalCount);
            // temp[idx]?.value.push(item.totalCount);
          });
        }

        series.push({
          name: keywordOv.title,
          type: "line",
          data: keywordOv.daily.map((item) => {
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

fetchKeywordGroupList();
</script>

<style lang="scss" scoped></style>
