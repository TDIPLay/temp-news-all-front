<template>
  <div class="home">
    <MainLayout @content-scroll="infiniteScrolling">
      <PageHeader>
        <template #title>
          <div class="row m-0 align-items-center">
            <div class="col">
              <span class="fw-bolder font-size-18">브리핑 작성</span>
            </div>
          </div>
        </template>
        <template #right>
          <div
            class="d-flex justify-content-end"
            v-if="selectedBriefing.briefing_no"
          >
            <div class="col-auto text-h6 pt-0">
              <button
                class="btn btn-outline-secondary me-2"
                @click="openPreviewPage()"
              >
                내보내기
              </button>

              <button
                class="btn btn-outline-primary"
                type="menu"
                id="dropdownSendMail"
                :aria-haspopup="showSendMailDropdown"
                data-bs-toggle="dropdown"
                :aria-expanded="true"
              >
                공유하기
              </button>
              <div
                class="dropdown-menu p-0"
                aria-labelledby="dropdownSendMail"
                style="width: 300px"
              >
                <div class="card m-0 b-dropdown-form">
                  <div class="card-body row m-0 align-items-center">
                    <h4 class="col-12 card-title mb-2 d-flex px-0">
                      <i class="me-1 mdi mdi-link"> </i>
                      링크 복사
                    </h4>
                    <div class="d-flex px-0">
                      <input
                        :value="selectedBriefing.preview_link"
                        class="col form-control"
                        readonly
                      />
                      <div class="col-auto ms-1">
                        <button class="btn btn-primary">
                          <i
                            class="mdi mdi-content-copy"
                            @click="copyToLink(selectedBriefing.preview_link)"
                          >
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </PageHeader>
      <div class="row briefing-edit-wrap pb-3 mb-5">
        <div class="col-md-8 col-lg-7">
          <div class="card">
            <div class="card-body text-start">
              <!-- 뉴스 보도 작성 -->
              <h4 class="card-title mb-2 row"></h4>
              <div class="briefing-wrap">
                <div class="custom_header row m-0 border-bottom">
                  <input
                    v-model="selectedBriefing.briefing_title"
                    placeholder="제목"
                    class="custom_input_box col-12 w-100 fw-bolder"
                    type="text"
                  />

                  <div class="reporter_data col-12 d-flex">
                    <input
                      v-model="selectedBriefing.reported_date"
                      placeholder="일자"
                      class="custom_input_box col-auto fw-bolder"
                      style="width: 100px"
                      type="text"
                    />
                    <span class="col-auto">|</span>
                    <input
                      v-model="selectedBriefing.reporter"
                      placeholder="작성자"
                      class="custom_input_box col fw-bolder"
                      type="text"
                    />
                  </div>
                </div>

                <div class="custom_content">
                  <ckeditor
                    :editor="ClassicEditor"
                    v-model="selectedBriefing.briefing_content"
                    :config="editorConfig"
                  >
                  </ckeditor>

                  <div class="custom_slt_news_list_wrap custom_news_list">
                    <p
                      class="empty"
                      v-if="!selectedBriefing.briefing_news_list.length"
                    >
                      미디어 스크랩 목록에서 브리핑을 만들 뉴스를 선택해주세요.
                    </p>
                    <template v-else>
                      <CommonDragable
                        :list-item="selectedBriefing.briefing_news_list"
                        :depth="0"
                        title-key="group_name"
                        :children-key="'news_list'"
                        children-title-key="news_title"
                        :children-readonly="true"
                        @delete="selectedBrefingDeleteNews"
                        @delete-group="selectedBrefingDeleteNewsGroup"
                        @add-report="selectedBrefingAddReport"
                      >
                      </CommonDragable>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <!-- end table responsive -->
          </div>
        </div>

        <div class="col-md-4 col-lg-5">
          <div class="card">
            <div class="card-body text-start custom_right_list_box">
              <!--  뉴스 보도 문의 담당자 정보 -->
              <h4 class="card-title d-flex align-items-center">
                <span class="col"> 저장 뉴스 </span>

                <div class="date_filter-btn">
                  <select
                    @change="changeDateType"
                    v-model="saveNewsDateFilter.days"
                    class="form-select ma-2"
                  >
                    <option
                      v-for="(item, index) in dateTypeItems"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.text }}
                    </option>
                  </select>
                </div>
              </h4>
              <template v-if="saveNewsGroups.length">
                <div
                  class="custom-accordion"
                  v-for="(group, idx) in saveNewsGroups"
                  :key="idx"
                >
                  <span
                    class="custom-accordion-title collapsed fw-bolder p-2 d-flex align-items-center"
                    data-bs-toggle="collapse"
                    :href="`#group_collapse_${idx}`"
                  >
                    {{ group.keyword }}
                    <span class="text-caption text-blue ms-1">
                      ({{ group.news_list.length }})
                    </span>

                    <i class="mdi mdi-chevron-down accor-down-icon ms-auto"></i>
                  </span>

                  <div class="collapse" :id="`group_collapse_${idx}`">
                    <div
                      v-for="(news, nIdx) in group.news_list"
                      :key="nIdx"
                      class="card m-1 mb-2 py-3 px-3 d-flex border"
                      :class="{
                        active_card: flatSelectedNewsNoList.includes(
                          news.news_no
                        ),
                      }"
                      @click="handleNewsClick(news)"
                    >
                      <div
                        class="custom_list_title overflow-text flex-self-end"
                        v-html="news.news_title"
                      ></div>
                      <div class="d-flex mt-1">
                        <span class="col-auto text-caption">
                          {{ news.pub_date_format }}
                        </span>
                        <template v-if="news.press_name">
                          <span class="col-auto text-caption px-2">|</span>
                          <span class="col text-caption">{{
                            news.press_name
                          }}</span>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="container-white_box">
                <div
                  class="empty_component row align-items-center"
                  style="color: #d6dce2; height: 400px"
                >
                  <div class="col text-center">
                    <i class="mdi mdi-information-outline font-size-24"></i>
                    <div class="empty_text font-size-16">
                      저장된 뉴스가 없습니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="isEditable"
            class="btn btn-primary mx-auto w-100 mb-5"
            :disabled="loading"
            type="button"
            @click="submit()"
          >
            발행하기
          </button>
        </div>
        <!--end col-->
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useFetch } from "./IndexPageBase";

import PageHeader from "@/components/layouts/page-header.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import CommonDragable from "@/components/common/CommonDragable.vue";

import { useCommonStore } from "@/store/common";
import { useRouter, useRoute } from "vue-router";
import { CommonUtils } from "@/utils/CommonUtils";
const { loading, showNoti } = useCommonStore();

const {
  selectedBriefing,
  isEditable,
  editorConfig,
  saveNewsDateFilter,
  saveNewsGroups,

  fetchBriefingInfo,
  fetchSaveNewsList,
  submit,
  openPreviewPage,
  changeDateType,
  handleNewsClick,
  selectedBrefingAddReport,
} = useFetch();

const route = useRoute();
const router = useRouter();
const sltNo = route.query.no;
const dateTypeItems = [
  {
    text: "오늘",
    value: 0,
  },
  {
    text: "최근 7일",
    value: 7,
  },
  {
    text: "최근 10일",
    value: 10,
  },
  {
    text: "최근 한달",
    value: 30,
  },
];

const flatSelectedNewsNoList = computed(() => {
  let temp: any[] = [];

  selectedBriefing.value.briefing_news_list.map(
    (item) => (temp = [...temp, ...item.news_list.map((news) => news.news_no)])
  );
  return temp;
});

// 링크 복사
const copyToLink = (text: string) => {
  if (!text) return;

  CommonUtils.copyToClipboard(text);
  showNoti({
    message: "복사가 완료 되었습니다.",
  });
};

if (sltNo) {
  if (sltNo == "undefined") {
    showNoti({
      message: "해당 브리핑이 존재하지 않습니다.",
      type: "error",
    });
    router.replace("briefing");
  } else {
    fetchBriefingInfo(`${sltNo}`);
  }
}
fetchSaveNewsList();
</script>

<style lang="scss">
.briefing-edit-wrap {
  $primary: #556ee6;
  $danger: #f46a6a;

  .custom-accordion {
    .custom-accordion-title {
      cursor: pointer;
      border-radius: 4px;
      background-color: rgba($primary, 0.1);
      color: $primary;
      i::before {
        content: "\f0143" !important;
      }

      &.collapsed {
        background-color: transparent;
        color: #000;
        i::before {
          content: "\f0140" !important;
        }
      }

      &:hover {
        background-color: rgba($primary, 0.1);
      }
    }
    .collapse.show {
      .card {
        cursor: pointer;
        &:hover {
          border-color: rgba($primary, 0.5) !important;
        }
      }
    }
  }

  .text-caption {
    font-weight: 500;
    font-size: 11px;
  }

  .briefing-wrap {
    .ck-editor {
      background-color: transparent;
      .ck-toolbar {
        background-color: transparent !important;
      }
    }
    .custom_input_box {
      width: auto;
      border: 2px solid transparent;
      border-radius: 4px;

      &:focus {
        border-color: rgba($primary, 0.5);
      }
    }

    select {
      border: 2px solid #000;
      padding: 5px 10px;
      border-radius: 16px;
      width: 110px;
      font-size: 14px;
      font-weight: 600;

      // background-image: url(@/assets/img/common/icon_common-select.svg);
      background-position: calc(100% - 10px) center;
      background-repeat: no-repeat;
      background-color: #f7f9fb;
    }

    // 제목부분
    .custom_header {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: -0.5px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 2px solid #656b71;
      padding-bottom: 5px;
      margin-bottom: 5px;

      .reporter_data {
        margin: 10px 0;
        font-size: 14px;
        align-items: center;
        display: flex;

        span {
          width: auto;
          margin-right: 10px;
        }
      }

      .logo-img {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        align-self: flex-end;
        width: 120px;
        height: 70px;
        background-color: #eee;
      }
    }

    .custom_content {
      display: flex;
      flex-direction: column;
      padding: 20px 0;

      .ck-editor {
        width: 100%;
        min-height: 200px !important;
        height: auto;
      }
      .ck-editor__top {
        border-bottom: 1px solid #a4aab1;
      }
      .ck-content {
        border: 0px;

        &.ck-focused {
          border: 0px;
          box-shadow: none;
        }
      }

      // 선택한 뉴스 목록 영역
      .custom_slt_news_list_wrap {
        margin: 10px 0;
        .empty {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px dashed #a4aab1;
          height: 250px;
          width: 100%;
          color: #656b71;
        }
      }
    }
  }

  .custom_right_list_box {
    .custom_list_title {
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
