<template>
  <div class="home">
    <MainLayout>
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-25">브리핑</span>
            </div>
            <div class="col-auto">
              <div class="flex-shrink-0"></div>
            </div>
          </div>
        </template>
        <template #right>
          <router-link to="/briefing/edit" class="btn btn-primary me-1">
            <i class="mdi mdi-plus me-1"> </i>
            새로운 브리핑
          </router-link>
        </template>
      </PageHeader>

      <div class="filter-wrap px-2 py-3">
        <div class="filter-list p-2">
          <div class="row m-0 text-start">
            <div
              class="col-sm-auto pb-0 pb-sm-2 px-2 px-sm-4 text-sm-center fw-bolder d-flex align-items-center"
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
          <div class="row m-0 text-start pb-3">
            <div
              class="col-sm-auto pb-0 pb-sm-2 px-2 px-sm-4 text-sm-center fw-bolder d-flex align-items-center"
              style="padding: 12px"
            >
              검색 &nbsp;&nbsp;
            </div>
            <div
              class="d-flex col px-1 px-sm-2 m-0 align-items-center py-1 flex-column flex-sm-row"
            >
              <input
                type="search"
                class="form-control"
                v-model="filterObj.search_text"
                placeholder="검색어를 입력해 주세요."
                @keydown.enter="
                  async () => {
                    showLoading();
                    pagenation.isMax = false;
                    await fetchBriefingList();
                    await setFilteredList();
                  }
                "
              />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <button
            class="btn btn-outline-secondary ms-auto mt-2 col col-sm-auto"
            style="width: 100px"
            :disabled="loading"
            @click="init"
          >
            초기화
          </button>

          <button
            class="btn btn-dark ms-3 mt-2 col col-sm-auto me-auto"
            :disabled="loading"
            style="width: 100px"
            @click="
              async () => {
                showLoading();
                pagenation.isMax = false;
                await fetchBriefingList();
                await setFilteredList();
              }
            "
          >
            조회
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body p-0 pt-2">
              <div class="table-responsive">
                <table
                  class="table align-middle dt-responsive nowrap w-100 table-check table_hover"
                >
                  <thead>
                    <tr>
                      <th
                        v-for="(column, cIdx) in tbColumns"
                        :key="cIdx"
                        :class="column.class"
                        scope="col"
                      >
                        {{ column.name }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(briefing, dIdx) in filteredBriefingList"
                      :key="dIdx"
                    >
                      <td
                        v-for="(column, cIdx) in tbColumns"
                        :key="cIdx"
                        :scope="!cIdx ? 'row' : 'col'"
                        :class="column.class"
                        :style="{
                          ...column.style,
                        }"
                        class="overflow-text"
                        @click="
                          $router.push(
                            `/briefing/edit?no=${briefing.briefing_no}`
                          )
                        "
                      >
                        <template v-if="column.key == 'actions'">
                          <!-- <b-button
                            variant="soft-info"
                            class="btn-sm ms-2"
                            @click="listDeleteModal = !listDeleteModal"
                          >
                            <i class="mdi mdi-pencil-outline"> </i>
                          </b-button>

                          -->

                          <b-button
                            variant="soft-danger"
                            class="btn-sm ms-2"
                            @click.stop="
                              deleteBriefingClick(briefing.briefing_no)
                            "
                          >
                            <i class="mdi mdi-delete-outline"></i>
                          </b-button>
                        </template>

                        <template v-else>
                          {{ briefing[column.key] }}
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  v-if="!filteredBriefingList.length"
                  class="card mb-0"
                  style="min-height: calc(100vh - 560px)"
                >
                  <div
                    class="card-body row justify-content-center align-items-center m-0"
                  >
                    <h4 class="card-title">
                      <img
                        src="@/assets/img/no-data.png"
                        style="max-width: 250px"
                        class="mb-4"
                      />
                      <br />
                      브리핑이 존재하지 않습니다.
                    </h4>
                  </div>
                </div>
                <!-- end table -->
              </div>
              <!-- end table responsive -->
            </div>
            <!-- end card body -->
          </div>
          <!--end card-->
        </div>
        <!--end col-->
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import moment from "moment";
import Multiselect from "@vueform/multiselect";
import { useFetch } from "./IndexPageBase";

import PageHeader from "@/components/layouts/page-header.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import DatePicker from "vue3-datepicker";

import { useCommonStore } from "@/store/common";
import { Briefing } from "@/models/briefing";
const { loading, showLoading, hideLoading, showNoti } = useCommonStore();

const tbColumns = [
  {
    key: "briefing_no",
    class: "",
    name: "NO",
  },
  {
    key: "briefing_title",
    class: "text-start",
    name: "제목",
  },
  {
    key: "reporter",
    class: "",
    style: {
      "max-width": "500px",
    },
    name: "작성자",
  },
  {
    key: "reg_date_format",
    class: "",
    name: "작성일",
  },
  {
    key: "actions",
    class: "",
    name: "기능",
  },
];
const {
  briefingList,
  filterObj,
  selectedSearchDays,
  tempData,
  pagenation,

  fetchBriefingList,
  handleDeleteBriefing,
  handleUpdateDatePicker,
  handleSearchDay,
  initFilter,
} = useFetch();

const today = new Date();
const filteredBriefingList = ref<Briefing[]>([]);
const setFilteredList = () => {
  let searchText = filterObj.search_text;
  filteredBriefingList.value = briefingList.value.filter((item: any) => {
    return (searchText ? item.briefing_title.indexOf(searchText) > -1 : true) &&
      item.reg_date_format >= filterObj.start_date &&
      item.reg_date_format <= filterObj.end_date
      ? item
      : null;
  });
};
const deleteBriefingClick = async (briefing_no: string) => {
  const res = await handleDeleteBriefing(briefing_no);

  if (res) {
    await fetchBriefingList();
    await setFilteredList();
  }
};
const init = async () => {
  await initFilter();
  await fetchBriefingList();
  await setFilteredList();
};
init();
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
}
</style>
