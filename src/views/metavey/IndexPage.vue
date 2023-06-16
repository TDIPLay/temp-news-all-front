<template>
  <div class="home">
    <MainLayout :footer-hide="true">
      <div
        class="row m-0 text-start justify-content-center mx-auto align-items-center"
        style="max-width: 960px"
      >
        <img
          src="@/assets/img/metavey/intro_top.png"
          loading="lazy"
          border="0"
          usemap="#image-map"
          alt="메타베이 뉴스레터"
          class="col p-0"
        />

        <div class="col row p-5">
          <p class="col-12 fs-3 card-title text-primary fw-bolder py-3 px-0">
            메타베이에서 고객 인사이트를 발견하세요!
          </p>
          <ul class="col m-0 p-0">
            <ol class="fs-5 p-1">
              <span class="fw-bolder me-2">담당자 문의하기</span>
              신해영 팀장
            </ol>
            <ol class="fs-5 p-1">
              <i class="mdi mdi-phone-outline fw-bolder fs-4 me-2"></i>
              010-9266-7483 | 02-3487-5010
            </ol>
            <ol class="fs-5 p-1">
              <i class="mdi mdi-email-outline fw-bolder fs-4 me-2"></i>
              metavey@metavey.co.kr
            </ol>
          </ul>
          <div class="col col-12 col-md-auto p-0 py-4">
            <img
              src="@/assets/img/metavey/intro_btn.png"
              loading="lazy"
              border="0"
              alt="메타베이 문의하기"
              class="col p-0"
              @click="openNewTab"
            />
          </div>
        </div>

        <img
          src="@/assets/img/metavey/intro_bottom.png"
          loading="lazy"
          border="0"
          usemap="#image-map"
          alt="메타베이 뉴스레터"
          class="col-auto mx-auto p-0"
        />

        <!-- <div class="col-auto">
          <img
            src="@/assets/images/logo/metavey_logo.png"
            class="mb-3 mb-md-10"
          />

          <h3 class="text-h5 font-weight-bold mt-5 mb-3">메타베이란?</h3>
          <p class="text-subtitle-1">
            메타베이는 세계 최초로 페이지 이동 없이 <br />
            뉴스 화면 안에서 이뤄지는 서베이 플랫폼 입니다.
          </p>
          <h3 class="text-h5 font-weight-bold mt-5 mb-3">
            설문 조사, 이제 메타베이와 함께 <br />
            뉴스에서 시작해 보십시오.
          </h3>
          <p class="text-subtitle-1">
            자세한 내용은 아래의 소개서 및 설문 요청을 누르셔서<br />
            메타베이 홈페이지를 참고해 주세요.
          </p>
        </div>
        <div class="col self-center d-flex jutify-content-sm-center">
          <img
            src="@/assets/images/logo/metavey_main.png"
            style="width: 100%; max-width: 700px"
          />
        </div> -->
      </div>
      <!-- <div
        class="row m-0 my-2 px-2 p-md-10 justify-content-center justify-content-md-start"
      >
        <div class="col-auto">
          <a
            color="#4e4f5a"
            style="width: 180px"
            class="btn btn-secondary event-btn mr-3"
            href="/file/METAVEY_Service.pdf"
            download
          >
            <span> 소개서 다운로드 </span>
          </a>
        </div>
        <div class="col-auto">
          <button
            style="width: 180px; backgronnd-color: #6366f1"
            class="btn btn-primary event-btn"
            @click="openNewPage"
          >
            <i class="mdi mdi-chevron-right"></i>
            <span> 설문 의뢰하기</span>
          </button>
        </div>
      </div> -->
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import moment from "moment";

import PageHeader from "@/components/layouts/page-header.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const openNewTab = () => {
  window.open("https://metavey.co.kr");
};
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
