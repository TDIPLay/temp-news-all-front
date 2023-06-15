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
            <div class="card-body border d-flex status-card">
              <div
                class="col"
                :class="{
                  active: selectedDistribute.status == 1,
                }"
              >
                <i class="mdi mdi-pen me-2"></i>
                <div class="bredcrumb-text d-none d-md-block">배포신청</div>
              </div>
              <i class="col-auto mdi mdi-arrow-right"></i>

              <div
                class="col"
                :class="{
                  active: selectedDistribute.status == 2,
                }"
              >
                <i class="mdi mdi-note-search-outline me-2"></i>
                <span class="bredcrumb-text d-none d-md-block"
                  >신청서 검토</span
                >
              </div>
              <i class="col-auto mdi mdi-arrow-right"></i>

              <div
                class="col"
                :class="{
                  active: selectedDistribute.status == 3,
                }"
              >
                <i class="mdi mdi-sticker-check-outline me-2"></i>
                <div class="bredcrumb-text d-none d-md-block">
                  접수 완료
                  <span class="font-size-11">(이메일 안내) </span>
                </div>
              </div>
              <i class="col-auto mdi mdi-arrow-right"></i>

              <div
                class="col"
                :class="{
                  active: selectedDistribute.status == 4,
                }"
              >
                <i class="mdi mdi-send-outline"></i>
                <div class="bredcrumb-text d-none d-md-block">배포 진행</div>
              </div>
              <i class="col-auto mdi mdi-arrow-right"></i>

              <div
                class="col"
                :class="{
                  active: selectedDistribute.status == 5,
                }"
              >
                <i class="mdi mdi-send-check-outline"></i>
                <div class="bredcrumb-text d-none d-md-block">
                  배포 완료
                  <span class="font-size-11">(이메일 안내) </span>
                </div>
              </div>
            </div>
          </div>
          <!--end card-->
        </div>

        <div class="col-md-8 col-lg-7">
          <div class="card">
            <div class="card-body text-start">
              <!-- 뉴스 보도 작성 -->
              <h4 class="card-title mb-2 row">
                <div class="col p-0">뉴스 보도 작성</div>

                <div class="dropdown col-auto p-0" v-if="isAdmin">
                  <button
                    class="btn btn-outline-primary d-flex font-size-12"
                    type="button"
                    id="dropdownStatus"
                    data-bs-toggle="dropdown"
                    style="width: 110px"
                  >
                    <div class="col">
                      {{ selectedDistribute.status_text }}
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
                        active: selectedDistribute.status == option.value,
                      }"
                      @click="handleSelectStatusChange(option)"
                    >
                      {{ option.label }}
                    </li>
                  </ul>
                </div>
              </h4>

              <div class="form-group row mb-2">
                <label for="title" class="col-form-label col-xxl-2">
                  보도 제목
                </label>
                <div class="col-xxl-10">
                  <input
                    name="title"
                    type="text"
                    class="form-control"
                    placeholder="제목을 입력해 주세요."
                    v-model="selectedDistribute.news_title"
                    :disabled="!isEditable"
                  />
                </div>
              </div>
              <div class="form-group row mb-2">
                <label class="col-form-label col-xxl-2"> 보도 본문 </label>
                <div class="col-xxl-10">
                  <ckeditor
                    :editor="ClassicEditor"
                    v-model="selectedDistribute.news_content"
                    :config="editorConfig"
                    :disabled="!isEditable"
                  >
                  </ckeditor>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label
                  class="col-form-label col-xxl-2 position-relative"
                  id="tooltip-target-file"
                >
                  <span
                    @mouseover="tooltip.file = true"
                    @mouseleave="tooltip.file = false"
                  >
                    추가 자료
                    <i class="mdi mdi-information-outline font-size-14"> </i>
                  </span>
                  <div
                    class="tooltip position-absolute"
                    :class="{ show: tooltip.file, 'd-none': !tooltip.file }"
                    role="tooltip"
                    style="left: 80px; top: 0; min-width: max-content"
                  >
                    <div class="tooltip-arrow"></div>
                    <div class="tooltip-inner">
                      미디어킷 또는 뉴스 보도에 실릴 이미지를 첨부합니다. (png,
                      jpg, pdf)
                    </div>
                  </div>
                </label>

                <div class="col-xxl-10">
                  <label
                    class="row m-0 d-flex align-items-center form-control p-0"
                    for="customFile"
                    style="width: 100%"
                  >
                    <div
                      class="col px-3 overflow-text"
                      style="max-width: 100%; overflow: hidden"
                    >
                      {{
                        selectedDistribute.file
                          ? selectedDistribute.file?.name
                          : selectedDistribute.attached_file_name
                          ? selectedDistribute.attached_file_name
                          : "선택된 파일이 없습니다"
                      }}
                    </div>
                    <div class="px-5 py-2 fw-bold bg-soft bg-primary col-auto">
                      변경
                    </div>
                  </label>
                  <input
                    style="display: none"
                    :disabled="!isEditable"
                    type="file"
                    name="customFile"
                    id="customFile"
                    class="form-control"
                    accept="image/jpeg,image/png,image/jpg,.pdf"
                    @change="uploadImageFile($event.target)"
                  />
                </div>
              </div>
            </div>
            <!-- end table responsive -->
          </div>
        </div>

        <div class="col-md-4 col-lg-5">
          <div class="card">
            <div class="card-body text-start">
              <!--  뉴스 보도 문의 담당자 정보 -->
              <h4 class="card-title">뉴스 보도 문의 담당자 정보</h4>
              <div class="mb-2 font-size-11">
                기자분들의 문의를 대응하실 분의 연락처를 기입해 주세요.
              </div>
              <div class="form-group row mb-2">
                <label for="user_name" class="col-form-label col-xxl-2">
                  담당자명
                </label>
                <div class="col-xxl-10">
                  <input
                    name="user_name"
                    class="form-control"
                    autocomplete="off"
                    type="text"
                    :readonly="!isEditable"
                    v-model="selectedDistribute.user_name"
                    placeholder="담당자 이름을 입력하세요."
                  />
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="company_name" class="col-form-label col-xxl-2">
                  회사명
                </label>
                <div class="col-xxl-10">
                  <input
                    name="company_name"
                    class="form-control"
                    autocomplete="off"
                    :readonly="!isEditable"
                    type="text"
                    v-model="selectedDistribute.company_name"
                    placeholder="회사명을 입력하세요."
                  />
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="position_name" class="col-form-label col-xxl-2">
                  직급
                </label>
                <div class="col-xxl-10">
                  <input
                    name="position_name"
                    class="form-control"
                    autocomplete="off"
                    :readonly="!isEditable"
                    type="text"
                    v-model="selectedDistribute.position_name"
                    placeholder="직급을 입력하세요."
                  />
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="phone_number" class="col-form-label col-xxl-2">
                  담당자 연락처
                </label>
                <div class="col-xxl-10">
                  <input
                    name="phone_number"
                    class="form-control"
                    :readonly="!isEditable"
                    type="text"
                    v-model="selectedDistribute.phone_number"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="email" class="col-form-label col-xxl-2">
                  이메일
                </label>
                <div class="col-xxl-10">
                  <input
                    name="email"
                    class="form-control"
                    type="email"
                    :readonly="!isEditable"
                    v-model="selectedDistribute.email"
                    placeholder="이메일을 입력해 주세요."
                  />
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="homepage" class="col-form-label col-xxl-2">
                  홈페이지
                </label>
                <div class="col-xxl-10">
                  <input
                    name="homepage"
                    class="form-control"
                    autocomplete="off"
                    type="text"
                    :readonly="!isEditable"
                    v-model="selectedDistribute.homepage"
                    placeholder="홈페이지를 입력해 주세요."
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="isEditable"
            class="btn btn-primary mx-auto w-100"
            :disabled="loading"
            type="button"
            @click="submit()"
          >
            배포 신청
          </button>
        </div>
        <!--end col-->
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useFetch } from "./IndexPageBase";

import PageHeader from "@/components/layouts/page-header.vue";
import MainLayout from "@/layouts/MainLayout.vue";

import { useCommonStore } from "@/store/common";
import { useRouter, useRoute } from "vue-router";

const { loading, showNoti } = useCommonStore();

const tooltip = reactive({
  file: false,
});
const {
  DistributeNewsStatusOptions,
  selectedDistribute,
  isEditable,
  editorConfig,
  isAdmin,

  fetchDistributeInfo,
  uploadImageFile,
  submit,
  handleSelectStatusChange,
} = useFetch();

const route = useRoute();
const router = useRouter();
const sltNo = route.query.no;

if (sltNo) {
  if (sltNo == "undefined") {
    showNoti({
      message: "해당 보도자료가 존재하지 않습니다.",
      type: "error",
    });
    router.replace("/distribute");
  } else {
    fetchDistributeInfo(`${sltNo}`);
  }
}
</script>

<style lang="scss" scoped>
$primary: #556ee6;
$danger: #f46a6a;
.status-card {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  align-items: center;

  .col {
    i {
      font-size: 16px;
    }
    &.active {
      color: $primary;
      font-weight: 700;
    }
  }
}
</style>
