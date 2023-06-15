<template>
  <div class="home">
    <MainLayout :footer-hide="true">
      <div class="row m-0 text-start justify-content-center">
        <img
          src="https://metavey.co.kr/images/metavey-newsletter.png"
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
