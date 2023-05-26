<template>
  <div
    class="row preview-wrap m-0 align-items-center justify-content-center my-3"
  >
    <div class="col-12 m-0" style="max-width: 720px">
      <div class="col-auto my-3 d-flex justify-content-end">
        <button
          class="me-3 btn btn-outline-primary dropdown"
          type="menu"
          id="dropdownSendMail"
          :aria-haspopup="showSendMailDropdown"
          data-bs-toggle="dropdown"
          :aria-expanded="true"
        >
          Mail 내보내기
        </button>
        <div
          class="dropdown-menu p-0"
          aria-labelledby="dropdownSendMail"
          style="width: 300px"
        >
          <div class="card m-0 b-dropdown-form">
            <div class="card-body row m-0 align-items-center">
              <h4 class="card-title mb-2 d-flex">
                <i class="me-1 mdi mdi-link"> </i>
                이메일 공유
              </h4>
              <div class="col-12 overflow-text px-0 py-2">
                <input
                  v-model="shareEmail"
                  type="email"
                  class="forn-control"
                  style="
                    width: 100%;
                    padding: 5px;
                    border: 1px solid #a4aab1;
                    border-radius: 5px;
                  "
                  placeholder="전송받을 이메일을 입력해주세요."
                />
              </div>
              <div class="col p-0 pt-2 text-end">
                <button
                  class="px-3 py-1 btn btn-primary"
                  :disabled="!shareEmail"
                  @click="exportToMail()"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
        <button class="col-auto btn btn-outline-secondary" @click="exportToPDF">
          PDF 내보내기
        </button>
      </div>
    </div>
    <div class="col-12 text-start">
      <div ref="previewWrap" style="max-width: 720px; margin: auto">
        <div class="card border">
          <div class="card-body" v-if="briefingInfo">
            <table
              cellpadding="0"
              cellspacing="0"
              style="
                width: 100%;
                max-width: 720px;
                min-width: 288px;
                border-collapse: collapse;
                margin: auto;
              "
              bgcolor="#FFFFFF"
            >
              <tbody>
                <tr style="height: 24px"></tr>
                <tr
                  style="
                    height: 42px;
                    font-size: 13px;
                    letter-spacing: -0.5px;
                    color: #40454b;
                  "
                >
                  <td
                    style="
                      border-top-width: 2px;
                      border-top-color: #000;
                      border-top-style: solid;
                      border-bottom-width: 1px;
                      border-bottom-color: #efefef;
                      border-bottom-style: solid;
                    "
                  >
                    {{ briefingInfo.reporter }}
                  </td>
                  <td
                    align="right"
                    style="
                      border-top-width: 2px;
                      border-top-color: #000;
                      border-top-style: solid;
                      border-bottom-width: 1px;
                      border-bottom-color: #efefef;
                      border-bottom-style: solid;
                      width: 150px;
                    "
                  >
                    {{ briefingInfo.reported_date }}
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- header summary -->
            <table
              style="
                width: 100%;
                max-width: 720px;
                min-width: 288px;
                border-collapse: collapse;
                margin: auto;
              "
              bgcolor="#FFFFFF"
            >
              <tbody>
                <tr>
                  <td style="padding-top: 24px; word-break: break-all">
                    <span
                      style="
                        font-size: 24px;
                        line-height: 1.2em;
                        font-weight: bold;
                      "
                    >
                      {{ briefingInfo.briefing_title }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 24px; word-break: break-all">
                    <div
                      style="cursor: default"
                      v-html="briefingInfo.briefing_content"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- header summary -->
            <table
              cellpadding="0"
              cellspacing="0"
              style="
                border-collapse: collapse;
                width: 100%;
                max-width: 720px;
                min-width: 288px;
                table-layout: fixed;
                margin: auto;
              "
              bgcolor="#FFFFFF"
            >
              <!-- Report Loop Start -->
              <tbody
                v-for="(keyword_group, kIdx) in briefingInfo.briefing_news_list"
                :key="kIdx"
              >
                <!-- News_List Loop Start -->
                <tr>
                  <td
                    style="
                      font-size: 15px;
                      font-weight: bold;
                      line-height: 1.2em;
                      padding-left: 10px;
                      padding-top: 24px;
                    "
                  >
                    {{ keyword_group.group_name }}
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      font-size: 13px;
                      line-height: 1.2em;
                      font-weight: bold;
                      border-bottom: 2px solid #a4aab1;
                      padding: 0 0 8px;
                    "
                  ></td>
                </tr>

                <template
                  v-for="(news_item, nIdx) in keyword_group.news_list"
                  :key="nIdx"
                >
                  <tr style="height: 12px"></tr>
                  <tr>
                    <td style="padding: 5px 10px">
                      <a
                        :href="news_item.original_link"
                        target="_blank"
                        style="
                          text-decoration: none;
                          color: inherit;
                          display: block;
                          border: none;
                        "
                        rel="noreferrer noopener"
                      >
                        <span
                          style="
                            font-size: 13px;
                            font-weight: 600;
                            line-height: 1.2em;
                            display: block;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                          "
                          v-html="news_item.news_title"
                        >
                        </span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      :style="{
                        borderBottomWidth: '1px',
                        borderBottomColor: '#eee',
                        borderBottomStyle: 'solid',
                        padding: '3px 10px ',
                      }"
                    >
                      <a
                        :href="news_item.original_link"
                        target="_blank"
                        style="
                          text-decoration: none;
                          color: inherit;
                          display: block;
                          border: none;
                        "
                        rel="noreferrer noopener"
                      >
                        <span
                          style="
                            font-size: 13px;
                            display: block;
                            line-height: 1.2em;
                            color: #656b71;
                            padding-top: 4px;
                          "
                        >
                          {{ news_item.press_name }}
                          <span
                            v-if="news_item.press_name"
                            style="
                              padding: 0 10px;
                              font-weight: 900;
                              display: inline-block;
                            "
                          >
                            |
                          </span>
                          {{ news_item.pub_date }}
                        </span>
                      </a>
                    </td>
                  </tr>
                </template>

                <!-- News_List Loop End -->
              </tbody>
              <!-- Report Loop End -->
            </table>

            <!-- footer summary -->
            <table
              cellpadding="0"
              cellspacing="0"
              style="
                width: 100%;
                max-width: 720px;
                min-width: 288px;
                border-collapse: collapse;
                margin: auto;
              "
              bgcolor="#FFFFFF"
            >
              <tbody>
                <tr>
                  <td style="word-break: break-all; padding: 50px 0 20px">
                    <div style="cursor: default">
                      <div
                        style="
                          line-height: 1.5;
                          padding-top: 16px;
                          font-size: 16px;
                          color: black;
                        "
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- copyright -->
            <table
              cellpadding="0"
              cellspacing="0"
              style="
                width: 100%;
                max-width: 680px;
                min-width: 288px;
                border-collapse: collapse;
                margin: auto;
              "
              bgcolor="#FFFFFF"
            >
              <tbody>
                <tr style="height: 8px">
                  <td>
                    <div
                      style="
                        border-top-width: 2px;
                        border-top-color: #000;
                        border-top-style: solid;
                        margin-bottom: 4px;
                        line-height: 4px;
                      "
                    >
                      &nbsp;
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="height: 24px">
                    <span
                      style="
                        font-size: 14px;
                        line-height: 1.71;
                        font-weight: normal;
                        letter-spacing: -0.38px;
                        color: #40454b;
                      "
                    >
                      Copyright 2023 TDI, All rights reserved.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="height: 24px">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BriefingAPI } from "@/api/briefing";
import { Briefing } from "@/models/briefing";
// import html2pdf from "html2pdf.js";
import printJS from "print-js";
import { ref, watch } from "vue";
import { useCommonStore } from "@/store/common";
import { useRoute } from "vue-router";

const { showNoti, showLoading, hideLoading } = useCommonStore();

const route = useRoute();
const previewWrap = ref(null);
const showSendMailDropdown = ref(false);
const shareEmail = ref("");

let briefingKey = route.query?.key ? String(route.query.key) : "";
const briefingInfo = ref<Briefing>();

watch(showSendMailDropdown, (val) => {
  if (!val) {
    shareEmail.value = "";
  }
});

const fetchBriefingInfo = async (): Promise<void> => {
  const response = await BriefingAPI.getBriefingDistributeInfo(briefingKey);
  const { briefing } = response.data;

  if (briefing) {
    briefingInfo.value = new Briefing(briefing);
  }
};

// 메일 발송
const exportToMail = async () => {
  if (!briefingInfo.value) return;
  let msg = "";
  if (!shareEmail.value) {
    msg = "이메일을 작성해 주세요.";
  }
  const regex =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  if (!msg && !regex.test(shareEmail.value)) {
    msg = "이메일 형식에 맞게 작성해 주세요.";
  }
  // 메일 형식 올바르지 않으면 오류 메시지 노출
  if (msg) {
    showNoti({
      message: msg,
    });
    return;
  }
  showLoading();
  showSendMailDropdown.value = !showSendMailDropdown.value;

  const response = await BriefingAPI.exportBriefingDistribute(
    briefingInfo.value.briefing_no,
    shareEmail.value
  );

  const { result, message } = response.data;

  hideLoading();
  showNoti({
    message: message,
    type: result ? "" : "error",
  });
};
// PDF 다운로드
const exportToPDF = () => {
  printJS({
    printable: previewWrap.value,
    type: "html",
    // css: ["/print.css"],
    scanStyles: false,
  });
};

if (briefingKey) {
  fetchBriefingInfo();
}
</script>

<style lang="scss">
.preview-wrap {
  width: auto;
  margin: 0 auto;
  height: 100%;
}
</style>
