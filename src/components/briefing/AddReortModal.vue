<template>
  <b-modal
    v-model="isOpenDialog"
    centered
    title="기사 추가"
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @close="onCancle"
  >
    <div class="card row m-0" style="max-width: 600px">
      <h4 class="card-title">'{{ props.groupName }}'에 기사 추가</h4>

      <div class="form-group row m-0 mb-2">
        <label for="report_url" class="col-form-label"> URL 입력 </label>
        <div>
          <input
            name="report_url"
            type="text"
            class="form-control"
            v-model="fomDta.url"
            placeholder="기사 URL을 입력하세요."
          />
        </div>
      </div>

      <div class="form-group row m-0 mb-2">
        <label for="report_title" class="col-form-label"> 가사 제목 </label>
        <div>
          <input
            name="report_title"
            type="text"
            class="form-control"
            v-model="fomDta.title"
            placeholder="기사 제목을 입력하세요."
          />
        </div>
      </div>

      <div class="form-group row m-0 mb-2">
        <label class="col-form-label"> 빌헹일 </label>
        <div>
          <DatePicker
            :class="'form-control date-picker'"
            v-model="tempDate"
            :first-day-of-week="1"
            format="YYYY-MM-DD"
            lang="kr"
            placeholder="발행일"
            confirm
            @update:model-value="setDate(tempDate)"
          ></DatePicker>
        </div>
      </div>

      <div class="form-group row m-0 mb-2">
        <label for="report_media" class="col-form-label"> 미디어 명 </label>
        <div>
          <input
            name="report_media"
            type="text"
            class="form-control"
            v-model="fomDta.media"
            placeholder="미디어 명을 입력하세요."
          />
        </div>
      </div>
    </div>
    <div class="row ma-2 pt-3 justify-content-center border-top">
      <button
        @click="onCancle()"
        class="col-auto btn btn-outline-secondary px-4 me-2"
      >
        취소
      </button>

      <button @click="onsubmit()" class="col-auto btn btn-primary px-4">
        추가
      </button>
    </div>
  </b-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useCommonStore } from "@/store/common";
import DatePicker from "vue3-datepicker";

import moment from "moment";
const { showNoti } = useCommonStore();

const props = defineProps({
  groupNo: {
    type: String || Number,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "submit", value?: any): void;
  (e: "cancle", value?: any): void;
}>();

const today = moment().format("YYYY-MM-DD");
const isOpenDialog = ref(false);
const dateMenu = ref(false);
const fomDta = reactive({
  url: "",
  title: "",
  date: moment().format("YYYY-MM-DD"),
  media: "",
});
const tempDate = ref(new Date(fomDta.date));

const formatDate = computed(() => {
  return fomDta.date ? moment(fomDta.date).format("YYYY-MM-DD") : "";
});
const setDate = (date: string): void => {
  fomDta.date = moment(date).format("YYYY-MM-DD");
};
// 취소 or 닫기
const onCancle = (): void => {
  emit("cancle");
};
const onsubmit = (): void => {
  let msg = "";
  if (!fomDta.url) {
    msg = "기사 URL울 압력해 주세요.";
  }
  if (!msg && !fomDta.title) {
    msg = "기사 제목을 압력해 주세요.";
  }
  if (!msg && !fomDta.date) {
    msg = "기사 발행일을 압력해 주세요.";
  }
  if (!msg && !fomDta.media) {
    msg = "미디어 명을 압력해 주세요.";
  }

  if (msg) {
    showNoti({
      message: msg,
      type: "error",
    });
    return;
  }

  emit("submit", {
    ...fomDta,
    date: moment(fomDta.date, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm:ss"),
  });
};
onMounted(() => {
  isOpenDialog.value = true;
});
</script>

<style lang="scss" scoped>
.form-group {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.form_info_item {
  .form_info_title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 4px;
    h4 {
      font-weight: bold;
      font-size: 14px;
      color: #111;
    }
  }

  // input {
  //   border: solid 1px #e4e9f0;
  //   box-sizing: border-box;
  //   line-height: 40px;
  //   padding: 0 20px;
  //   border-radius: 26px;
  //   width: 100%;
  //   height: 42px;
  //   font-size: 14px;
  //   box-sizing: border-box;

  //   &::placeholder {
  //     color: #e4e9f0;
  //     font-size: 14px;
  //   }
  // }

  button.date-text-btn {
    font-size: 14px;
    height: 42px !important;
    position: relative;
    margin-top: 0 !important;
    border-radius: 26px;
    border: 1px solid #e4e9f0;
    background-color: #f7f9fb;
    // background-image: url(@/assets/img/common/calendar_icon_active.svg);
    background-repeat: no-repeat;
    background-position: 20px center;

    width: 100% !important;
    span {
      color: #080808;
      font-weight: 600;
    }
  }
}

button.action-primary-btn {
  background-color: #ef4118 !important;
  span {
    color: #fff;
  }
}
</style>
