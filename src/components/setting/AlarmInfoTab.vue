<template>
  <div class="p-2 pb-sm-3 alarm_info_warp mb-3">
    <div
      class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
    >
      <div class="card-title col-auto my-0 me-4">
        <h4 class="card-title">알림 시간</h4>
        <div class="font-size-11">
          12시간 이내 뉴스를 이메일로 확인할 수 있습니다.
        </div>
      </div>
      <h4
        class="d-flex m-0 align-items-center justify-content-end col"
        style="padding: 0.47rem 0.75rem"
      >
        <CommonTimePicker
          title="시작 시간"
          :value="curAlarmInfo.alarm_start_time"
          class="col-auto"
          :minute-unit="30"
          @input="
            (newVal:any) => {
              curAlarmInfo.alarm_start_time = `${newVal}`
              emit('set-data', {alarm_start_time: `${newVal}`})
            }
          "
        />
        <div class="col-auto px-1">~</div>
        <CommonTimePicker
          title="종료 시간"
          :value="curAlarmInfo.alarm_end_time"
          :minute-unit="30"
          class="col-auto"
          @input="
            (newVal:any) => {
              curAlarmInfo.alarm_end_time = `${newVal}`
              emit('set-data', {alarm_end_time: `${newVal}`})
            }
          "
        />
      </h4>
    </div>

    <div
      class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
    >
      <div class="card-title col-auto my-0 me-4">
        <template v-if="props.type == 'kakao'">
          <h4 class="card-title">휴대폰 번호</h4>
          <div class="font-size-11">
            알림톡을 받을 휴대폰 번호를 입력해 주세요.
          </div>
        </template>
        <template v-else>
          <h4 class="card-title">이메일 주소</h4>
          <div class="font-size-11">
            알림을 받을 이메일 주소를 입력해 주세요.
          </div>
        </template>
      </div>
      <div class="col text-right p-2">
        <input
          autocomplete="off"
          type="text"
          class="form-control ms-auto"
          style="max-width: 310px"
          v-model="curAlarmInfo.alarm_target"
          :placeholder="`${
            props.type == 'kakao' ? '연락처를' : '이메일 주소를'
          } 입력하세요.`"
          @change="
            emit('set-data', {
              alarm_target: curAlarmInfo.alarm_target,
            })
          "
        />
      </div>
    </div>

    <div
      class="py-0 col mt-3 flex-column align-items-start align-items-md-center"
    >
      <div class="card-title my-0 me-4">
        <h4 class="card-title">키워드 선택</h4>
        <div class="font-size-11">
          알림을 받을 키워드를 선택해 주세요.(최대 {{ props.maxCount }}개)
        </div>
      </div>
      <div class="col-12 card-body pe-0">
        <div
          class="custom-accordion"
          v-for="(keywordsGroup, gIndex) in props.keywordsGroupList"
          :key="gIndex"
          :value="keywordsGroup.group_no"
        >
          <span
            class="custom-accordion-title collapsed fw-bolder p-2 d-flex align-items-center"
            :href="`#${props.type}_group_collapse_${gIndex}`"
            data-bs-toggle="collapse"
          >
            <i class="mdi mdi-pound me-1 text-primary"></i>
            {{ keywordsGroup.group_name }}
            <span class="text-caption text-blue ms-1">
              ({{
                intersectionList(
                  keywordsGroup.keyword_no_list,
                  curAlarmInfo.keyword_no
                ).length
              }}/{{ keywordsGroup.keyword_list.length }})
            </span>

            <i class="mdi mdi-chevron-down accor-down-icon ms-auto"></i>
          </span>

          <div
            class="px-2 collapse"
            :id="`${props.type}_group_collapse_${gIndex}`"
          >
            <button
              v-for="(item, index) in keywordsGroup.keyword_list"
              :key="index"
              type="button"
              class="btn py-1 px-2 mb-2 me-2"
              :class="
                curAlarmInfo.keyword_no.includes(item.keyword_no)
                  ? 'btn-primary'
                  : 'btn-outline-primary'
              "
              :style="item.keyword.length > 8 ? 'width: 260px' : ''"
              @click="handleSelectKeyword(item.keyword_no)"
            >
              {{ item.keyword }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScrapKeywordGroup } from "@/models/scrap";
import { KakaoAlarmInfo, MailAlarmInfo, UserInfo } from "@/models/User";
import { useCommonStore } from "@/store/common";
import CommonTimePicker from "@/components/common/CommonTimePicker.vue";

import { ref, watch } from "vue";
const { showNoti } = useCommonStore();

const props = defineProps({
  type: {
    type: String,
    default: "mail",
  },
  maxCount: {
    type: Number,
    default: 10,
  },
  keywordsGroupList: {
    type: Array,
    default: () => [] as ScrapKeywordGroup[],
  },
  alarmInfo: {
    type: KakaoAlarmInfo || MailAlarmInfo,
    default: new MailAlarmInfo(),
  },
});
const curAlarmInfo = ref<MailAlarmInfo | KakaoAlarmInfo>();
const selectedGroupNo = ref(null);
const emit = defineEmits<{
  (e: "set-data", value?: any): void;
}>();
watch(
  () => props.alarmInfo,
  (newVal) => {
    curAlarmInfo.value =
      props.type == "kakao"
        ? new KakaoAlarmInfo(newVal)
        : new MailAlarmInfo(newVal);
  }
);

/**@description: 작은 배열 기준으로 교집합 */
const intersectionList = (groupIdList: string[], selectedList: string[]) => {
  return selectedList.length > groupIdList.length
    ? groupIdList.filter((x) => selectedList.includes(x))
    : selectedList.filter((x) => groupIdList.includes(x));
};

const handleSelectKeyword = (keyword_no: string | number) => {
  if (!curAlarmInfo.value) return;

  const idx = curAlarmInfo.value.keyword_no.findIndex(
    (item) => `${item}` === `${keyword_no}`
  );

  if (idx < 0) {
    if (curAlarmInfo.value.keyword_no.length === props.maxCount) {
      showNoti({
        message: `키워드는 최대 ${props.maxCount}개까지 선택 가능합니다.`,
      });
      return;
    }

    curAlarmInfo.value.keyword_no = [
      ...curAlarmInfo.value.keyword_no,
      keyword_no,
    ];
    emit("set-data", curAlarmInfo.value);
  } else {
    curAlarmInfo.value.keyword_no.splice(idx, 1);
    emit("set-data", curAlarmInfo.value);
  }
};

if (props.alarmInfo) {
  curAlarmInfo.value =
    props.type == "kakao"
      ? new KakaoAlarmInfo(props.alarmInfo)
      : new MailAlarmInfo(props.alarmInfo);
} else {
  curAlarmInfo.value =
    props.type == "kakao" ? new KakaoAlarmInfo() : new MailAlarmInfo();
}
</script>

<style lang="scss" scoped>
$primary: #556ee6;
$primary-1: rgba($primary, 0.5);
.alarm_info_warp > div {
  border-left: 2px solid;
  border-image-slice: 1;
  padding-left: 12px;
  border-width: 5px;
  border-image-source: linear-gradient(to bottom, $primary, $primary-1, #fff);
}
</style>
