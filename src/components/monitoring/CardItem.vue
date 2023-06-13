<template>
  <div
    class="news_card_item col-sm-6 col-xxxl-4"
    :class="{
      'col-xl-12': props.sortNum == 1,
      'col-sm-12': props.sortNum == 1,
      'col-xl-6': props.sortNum == 2,
      'col-sm-6': props.sortNum == 2,
    }"
  >
    <div class="card" @click="openNews">
      <div class="card-body">
        <div class="row">
          <div
            class="col-xl-4 col-xxxl-3 mb-2 mb-xxxl-0"
            style="position: relative; min-height: 120px"
          >
            <div class="noimg-thum-wrap">
              <img
                v-if="props.newsData.thumbnail"
                :src="props.newsData.thumbnail"
                class="noimg-thum"
                alt=""
              />
              <img
                v-else
                src="@/assets/img/noimg-thum.png"
                alt=""
                class="noimg-thum"
              />
            </div>
          </div>

          <div class="col-xl-8 col-xxxl-9">
            <div>
              <div class="d-flex m-0">
                <div
                  class="col text-start px-0 pb-2 d-flex overflow-text align-items-center"
                >
                  <span
                    class="col-auto badge fw-bolder font-size-11 me-2 px-2"
                    :class="{
                      'bg-negative': props.newsData.scoreTypeCode < 0,
                      'bg-positive': props.newsData.scoreTypeCode > 0,
                      'bg-neutrality': props.newsData.scoreTypeCode == 0,
                    }"
                    style="letter-spacing: 1.5px"
                  >
                    {{ props.newsData.scoreTypeText }}
                  </span>
                  <!-- 긍부정 키워드 우선 안보이게  -->
                  <!-- <div
                    v-if="
                      !!props.newsData.nlp_keyword &&
                      props.newsData.nlp_keyword.length > 0
                    "
                    class="col overflow-text"
                  >
                    <span
                      v-for="(k, kIdx) in props.newsData.nlp_keyword"
                      :key="kIdx"
                      class="col-auto fw-bolder font-size-11 me-1"
                      :class="{
                        'text-danger': props.newsData.scoreTypeCode < 0,
                        'text-success': props.newsData.scoreTypeCode > 0,
                        'text-warning': props.newsData.scoreTypeCode == 0,
                      }"
                    >
                      #{{ k }}
                    </span>
                  </div> -->
                </div>
                <div
                  class="col-auto ms-3 pe-0 save-icon align-self-end"
                  v-if="props.useSaveBtn"
                  @click.stop="saveNewsItem"
                >
                  <i
                    class="font-size-24 mdi"
                    :class="{
                      'mdi-bookmark-outline text-secondary': !active,
                      'mdi-bookmark text-danger': active,
                    }"
                  ></i>
                </div>
              </div>

              <h5
                class="d-block card-title mb-2 text-start overflow-text fw-bolder"
                v-html="props.newsData.news_title"
                data-toggle="tooltip"
                data-placement="top"
                :title="props.newsData.news_title"
              ></h5>
              <p
                v-html="props.newsData.description"
                class="text-start overflow-text-line-2 mb-2"
                data-toggle="tooltip"
                data-placement="top"
                :title="props.newsData.description"
              />

              <h5
                class="row font-size-13 fw-bold justify-content-end m-0 align-items-center mb-2"
                style="height: 20px"
              >
                <!-- 긍/부정 댓글 둘다 0이거나, 플랫폼이 뉴스인 경우에는 표시 안함 -->
                <template
                  v-if="
                    props.newsData.platform < 2 &&
                    (props.newsData.replyNoneSympathyPer ||
                      props.newsData.replySympathyPer)
                  "
                >
                  <div class="col-auto px-1 badge badge-soft-primary me-2">
                    <i class="mdi mdi-thumb-up-outline me-1"></i>
                    긍정 댓글

                    {{ props.newsData.replySympathyPer }}%
                  </div>

                  <div class="col-auto px-1 badge badge-soft-danger">
                    <i class="mdi mdi-thumb-down-outline me-1"></i>
                    부정 댓글
                    {{ props.newsData.replyNoneSympathyPer }}%
                  </div>
                </template>
              </h5>
              <h5
                class="row font-size-11 fw-bold text-start m-0 align-items-center"
              >
                <div class="col-auto px-0 pb-md-0 pb-2">
                  <span
                    class="badge fw-bolder font-size-11 badge-soft-secondary me-2"
                  >
                    # {{ props.newsData.keyword }}
                  </span>
                </div>

                <!-- platform == 1: 뉴스 -->
                <template v-if="props.newsData.platform < 2">
                  <div
                    class="col text-primary p-0 d-flex align-items-center justify-content-end"
                  >
                    <span
                      style="max-width: 100px"
                      class="text-primary d-inline-block overflow-text"
                    >
                      {{ props.newsData.press_name }}
                    </span>
                  </div>
                  <div class="col-auto px-2" v-if="props.newsData.press_name">
                    |
                  </div>
                </template>
                <!-- platform == 2: 카페 / 3:  블로그-->
                <template v-else>
                  <div class="col p-0 d-flex align-items-center">
                    <img
                      :src="`/img/icon/platform_${props.newsData.platform}.png`"
                      style="width: 14px"
                      class="d-inline-block ms-auto me-1"
                    />
                    <span
                      style="max-width: 85px"
                      class="text-success d-inline-block overflow-text"
                    >
                      {{ props.newsData.press_name }}
                    </span>
                  </div>
                  <div class="col-auto px-2">|</div>
                </template>
                <div class="col-auto text-secondary p-0">
                  {{ moment(props.newsData.pub_date).format("YYYY-MM-DD") }}
                </div>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

import moment from "moment";

import { NewListItem } from "@/models/scrap";
import { useCommonStore } from "@/store/common";
import { KeywordAPI } from "@/api/keyword";

const { showNoti } = useCommonStore();

const active = ref(false);
const firstCount = ref(false);
const resizing = ref(false);

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  id: {
    type: Number || String,
    default: "",
  },
  newsData: {
    default: new NewListItem(),
  },
  sort: {
    type: Number,
    default: 1,
  },
  useSaveBtn: {
    type: Boolean,
    default: true,
  },
  saveStatus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "set-sort-list", value?: any): void;
  (e: "click-keyword", value?: any): void;
}>();

watch(
  () => props.newsData,
  (newVal, prevVal) => {
    if (newVal !== prevVal) {
      // width 가 더 크면 높이를 100%으로
      if (props.newsData.thumbnail) {
        getMeta(props.newsData.thumbnail, (err, img: any) => {
          resizing.value =
            img?.naturalHeight && img?.naturalWidth
              ? img.naturalHeight + 85 >= img.naturalWidth
              : false;
        });
      }
    }

    setSort(props.sort);
  }
);

watch(
  () => props.index,
  (newVal, prevVal) => {
    if (newVal !== prevVal) {
      firstCount.value = newVal % 2 === 0;
    }

    setSort(props.sort);
  }
);

const getMeta = (
  url: string,
  cb: {
    (err?: any, img?: any): void;
    (err?: any, img?: any): void;
    (arg0: string | Event | null, arg1: HTMLImageElement | undefined): any;
  }
) => {
  const img = new Image();
  img.onload = () => cb(null, img);
  img.onerror = (err) => cb(err);
  img.src = url;
};

const openNews = () => {
  window.open(props.newsData.original_link);
  // console.log(props.newsData);
  // try {
  //   window.webToAppSelectNewUrl.postMessage(props.newsData.original_link);
  // } catch (err) {
  //   console.log(err);
  //   window.open(props.newsData.original_link);
  // }
};

const searchKeyword = async () => {
  emit("click-keyword", {
    keyword: props.newsData.keyword,
    keyword_no: props.newsData.keyword_no,
  });
  // await $store.commit("keyword/setKeyword", this.tag);
  // await $router.push({ name: "HomeView" });
};
const saveNewsItem = async () => {
  const response = active.value
    ? await KeywordAPI.deleteNewsSave(props.id, props.newsData.keyword)
    : await KeywordAPI.createNewsSave(props.id, props.newsData.keyword);

  const { result, message } = response?.data;
  if (result) {
    showNoti({
      message: message,
    });

    active.value = !active.value;
  } else {
    showNoti({
      message: message,
      type: "error",
    });
  }

  // axiosService.post("v2/news/search/preserve", params).then(() => {
  //   if (active.value === true) {
  //     // this.$store.commit("controller/setMsg", "보관함에서 삭제되었습니다.");
  //     emit("reload");
  //   } else {
  //     // this.$store.commit("controller/setMsg", "보관함에 저장되었습니다.");
  //     save.value = true;
  //   }
  // });
};

const setSort = (sort: number) => {
  if (props.newsData.thumbnail) {
    getMeta(props.newsData.thumbnail, (err: any, img: any) => {
      // width 가 더 크면 높이를 100%으로
      resizing.value =
        img?.naturalHeight && img?.naturalWidth
          ? img.naturalHeight + 85 >= img.naturalWidth
          : false;
    });
  }

  active.value = props.newsData.save_status ? true : false;
  firstCount.value = props.index % 2 === 0;

  // sort01.value = sort02.value = sort03.value = false;
  // switch (sort) {
  //   case 0: {
  //     sort01.value = true;
  //     break;
  //   }
  //   case 1: {
  //     sort02.value = true;
  //     break;
  //   }
  //   case 2: {
  //     sort03.value = true;
  //     break;
  //   }
  // }
};

onMounted(() => {
  setSort(props.sort);
});
</script>

<style lang="scss" scoped>
$primary: #556ee6;
$danger: #f46a6a;
.news_card_item {
  .card {
    border: 2px solid #fff;
    box-sizing: border-box;
  }
  .card:hover {
    cursor: pointer;
    filter: opacity(0.5);
    border-color: rgba($primary, 0.6);
  }
  .save-icon {
    transition: all 0.4s;
    margin-top: -8px;
    &:hover {
      transform: scale(1.2);
    }
  }
  .noimg-thum-wrap {
    width: 95%;
    z-index: 1;
    height: 100%;
    position: absolute;
    display: flex;
    background-color: #f1f4f8;
    left: 2.5%;
    top: 0;
    .noimg-thum {
      max-width: 100%;
      max-height: 100%;
      z-index: 1;
      margin: auto;

      // background-image: url(@/assets/img/noimg-thum.png);
      // background-size: cover;
      // background-position: center;
    }
  }
}

@media (min-width: 1750px) {
  .col-xxxl-auto {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: auto;
  }
  .col-xxxl-1 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 8.33333%;
  }
  .col-xxxl-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 16.66667%;
  }
  .col-xxxl-3 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 25%;
  }
  .col-xxxl-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 33.33333%;
  }
  .col-xxxl-5 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 41.66667%;
  }
  .col-xxxl-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 50%;
  }
  .col-xxxl-7 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 58.33333%;
  }
  .col-xxxl-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 66.66667%;
  }
  .col-xxxl-9 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 75%;
  }
  .col-xxxl-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 83.33333%;
  }
  .col-xxxl-11 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 91.66667%;
  }
  .col-xxxl-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 100%;
  }
}
</style>
