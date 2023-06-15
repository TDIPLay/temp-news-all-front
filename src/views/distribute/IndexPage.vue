<template>
  <div class="home">
    <MainLayout>
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-25">뉴스 보도</span>
            </div>
          </div>
        </template>
      </PageHeader>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body filter-wrap border-bottom">
              <div class="d-flex align-items-center mb-3">
                <h5 class="mb-0 card-title flex-grow-1"></h5>
                <div class="flex-shrink-0">
                  <router-link
                    to="/distribute/edit"
                    class="btn btn-primary me-1"
                  >
                    <i class="mdi mdi-plus me-1"> </i>
                    새로운 보도
                  </router-link>

                  <!-- <div class="dropdown d-inline-block">
                    <button
                      type="menu"
                      class="btn btn-success"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="mdi mdi-dots-vertical"></i>
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li><a class="dropdown-item" href="#">Action</a></li>
                      <li>
                        <a class="dropdown-item" href="#">Another action</a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#"
                          >Something else here</a
                        >
                      </li>
                    </ul>
                  </div> -->
                </div>
              </div>

              <dl class="row align-items-center m-0 text-start">
                <dt class="col-sm-2 py-2 text-sm-center">상태</dt>
                <dd class="col-sm-3 px-1 px-sm-2 m-0 align-items-center py-1">
                  <div class="dropdown w-100">
                    <button
                      class="btn btn-outline-primary d-flex w-100 font-size-12"
                      type="button"
                      id="dropdownStatus"
                      data-bs-toggle="dropdown"
                    >
                      <div class="col">
                        {{
                          !filterObj.status.length
                            ? "전체"
                            : filterObj.status.length > 1
                            ? `${filterObj.status[0].label}외 ${
                                filterObj.status.length - 1
                              }개`
                            : filterObj.status[0].label
                        }}
                      </div>
                      <i class="mdi mdi-chevron-down"></i>
                    </button>
                    <ul
                      class="dropdown-menu py-0"
                      aria-labelledby="dropdownStatus"
                    >
                      <li
                        v-for="(option, idx) in DistributeNewsStatusOptions"
                        :key="idx"
                        class="dropdown-item py-2"
                        :class="{
                          'border-top': idx > 0,
                          active: filterStatusIds.includes(option.value),
                        }"
                        @click="handleFilterStatus(option)"
                      >
                        {{ option.label }}
                      </li>
                    </ul>
                  </div>
                </dd>

                <dt class="col-sm-2 py-2 text-sm-center">기간</dt>
                <dd
                  class="d-flex col-sm-5 px-1 px-sm-2 m-0 align-items-center py-1"
                >
                  <div class="col">
                    <DatePicker
                      :class="'form-control date-picker'"
                      v-model="tempData.start_date"
                      :first-day-of-week="1"
                      format="YYYY-MM-DD"
                      lang="kr"
                      placeholder="시작일"
                      confirm
                      :upper-limit="today"
                      @update:model-value="
                        filterObj.start_date = moment(
                          tempData.start_date
                        ).format('YYYY-MM-DD')
                      "
                    ></DatePicker>
                  </div>
                  <span class="p-1 p-sm-2 px-sm-1 px-md-2"> ~ </span>
                  <div class="col">
                    <DatePicker
                      class="form-control col date-picker"
                      v-model="tempData.end_date"
                      :first-day-of-week="1"
                      lang="kr"
                      placeholder="종료일"
                      confirm
                      :upper-limit="today"
                      @update:model-value="
                        filterObj.end_date = moment(tempData.end_date).format(
                          'YYYY-MM-DD'
                        )
                      "
                    ></DatePicker>
                  </div>
                </dd>

                <dt class="col-sm-2 py-2 text-sm-center">검색</dt>
                <dd class="col-sm-10 px-1 px-sm-2 m-0 align-items-center py-1">
                  <input
                    type="search"
                    class="form-control"
                    v-model="filterObj.search_text"
                    placeholder="검색어를 입력해 주세요."
                    @keydown.enter="
                      async () => {
                        showLoading();
                        pagenation.isMax = false;
                        await fetchDistributeList();
                        await setFilteredList();
                      }
                    "
                  />
                </dd>
              </dl>

              <button
                class="btn btn-outline-secondary ms-auto mt-2"
                style="width: 100px"
                :disabled="loading"
                @click="init"
              >
                초기화
              </button>

              <button
                class="btn btn-secondary ms-3 mt-2"
                :disabled="loading"
                style="width: 100px"
                @click="
                  async () => {
                    showLoading();
                    pagenation.isMax = false;
                    await fetchDistributeList();
                    await setFilteredList();
                  }
                "
              >
                조회
              </button>
            </div>
            <div class="card-body px-0">
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
                      v-for="(distribute, dIdx) in filteredDistributeList"
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
                            `/distribute/edit?no=${distribute.dis_no}`
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
                              handleDeleteDistibute(distribute.dis_no)
                            "
                          >
                            <i class="mdi mdi-delete-outline"></i>
                          </b-button>
                        </template>
                        <template v-else-if="column.key == 'status'">
                          <span
                            class="badge py-1"
                            :style="{
                              color: `rgb(${distribute.badge_color})`,
                              'background-color': `rgba(${distribute.badge_color}, 0.18)`,
                              width: '60px',
                            }"
                          >
                            {{ distribute.status_text }}
                          </span>
                        </template>
                        <template v-else>
                          {{ distribute[column.key] }}
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  v-if="!filteredDistributeList.length"
                  class="card"
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
                      보도자료가 존재하지 않습니다.
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
import { computed } from "@vue/reactivity";
import { DistributeNews } from "@/models/distribute";
const { loading, showLoading, hideLoading, showNoti } = useCommonStore();
const today = new Date();
const tbColumns = [
  {
    key: "dis_no",
    class: "",
    name: "NO",
  },
  {
    key: "news_title",
    class: "text-start",
    name: "제목",
  },
  {
    key: "user_name",
    class: "",
    style: {
      "max-width": "500px",
    },
    name: "작성자",
  },

  {
    key: "status",
    class: "",
    name: "상태",
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
  DistributeNewsStatusOptions,
  distributeList,
  filterObj,
  tempData,
  pagenation,

  fetchDistributeList,
  handleDeleteDistibute,
  initFilter,
  handleFilterStatus,
} = useFetch();

const filterStatusIds = computed(() => filterObj.status.map((s) => s.value));
const filteredDistributeList = ref<DistributeNews[]>([]);
const setFilteredList = () => {
  let chStatus =
    filterObj.status.length > 0 ? filterObj.status.map((s) => s.value) : null;
  let searchText = filterObj.search_text;

  filteredDistributeList.value = distributeList.value.filter((item: any) => {
    return (chStatus ? chStatus.includes(item.status) : true) &&
      (searchText ? item.news_title.indexOf(searchText) > -1 : true) &&
      item.reg_date_format >= filterObj.start_date &&
      item.reg_date_format <= filterObj.end_date
      ? item
      : null;
  });
};

const init = async () => {
  await initFilter();
  await fetchDistributeList();
  await setFilteredList();
};
init();
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
