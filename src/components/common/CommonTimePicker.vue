<template>
  <!-- 필터 기능을 데이터를 전달하는데 있습니다.
해당 필터 컴포넌트는 라우트를 시키고 상태를 전달하는 역할입니다. -->
  <div
    class="custom-time-picker date_filter-wrap mt-0"
    style="justify-content: space-between"
    v-click-outside="() => (show ? (show = false) : '')"
  >
    <div class="date_filter-option">
      <div class="date_filter-date position-relative">
        <button
          class="btn btn-soft-dark btn-outline-dark"
          type="menu"
          id="dropdownSendMail"
          :aria-haspopup="show"
          :aria-expanded="true"
          @click="show = !show"
        >
          <i class="mdi mdi-clock"></i>
          <span class="ps-1 date-text">
            {{ title ? title : "" }}
          </span>
          <span class="ps-3 date-text">
            {{ formatTime }}
          </span>
        </button>
        <div
          v-if="show"
          class="dropdown-menu p-0 card dropdown-menu-end"
          style="width: 300px; border-radius: 8px; overflow: hidden"
          :class="{
            show: show,
            fade: !show,
          }"
        >
          <div class="custom-time-picker-content">
            <div class="row title-text m-0 py-2">
              <div class="col-6 text-center card-title pt-1">시</div>
              <div class="col-6 text-center card-title pt-1">분</div>
            </div>
            <div class="row m-0">
              <div class="col-6 p-0" style="overflow: auto; height: 150px">
                <div
                  v-for="(hour, index) in hourOptions"
                  :key="index"
                  ripple
                  class="text-center py-2 time-list-item"
                  :class="{
                    active: Number(hour) === Number(time.hour),
                  }"
                  @click="time.hour = hour"
                >
                  {{ hour }}
                </div>
              </div>
              <div class="col-6 p-0" style="overflow: auto; height: 150px">
                <div
                  v-for="(minute, index) in minuteOptions"
                  :key="index"
                  ripple
                  class="text-center py-2 time-list-item"
                  :class="{
                    active: minute === time.minute,
                  }"
                  @click="time.minute = minute"
                >
                  {{ minute }}
                </div>
              </div>
            </div>
            <div class="row title-text m-0 p-2 justify-content-end">
              <button
                @click="handleCancle"
                class="col-auto btn btn-outline-secondary"
              >
                취소
              </button>
              <button class="col-auto btn btn-dark ms-2" @click="handleOkBtn">
                적용
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const props = defineProps({
  title: {
    require: false,
    type: String,
  },
  value: {
    type: String,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 24,
  },
  minuteUnit: {
    require: false,
    type: Number,
    default: 1,
  },
  includeMin: {
    require: false,
    type: Boolean,
    default: false,
  },
  includeMax: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "input", value?: any): void;
  (e: "close", value?: any): void;
}>();
const time = ref<{
  type: string;
  hour: string | number;
  minute: string | number;
}>({
  type: "am",
  hour: 1,
  minute: 0,
});
const orgTime = ref<{
  type: string;
  hour: string | number;
  minute: string | number;
}>({
  type: "am",
  hour: 1,
  minute: 0,
});
const getFormatTime = (num: string | number) => {
  let t: string | number = Number(num);
  if (t < 10) {
    t = "0" + t;
  }
  return `${t}`;
};

const formatTime = computed(() => {
  return (
    getFormatTime(time.value.hour) + ":" + getFormatTime(time.value.minute)
  );
});

const show = ref(false);
const hourOptions = ref<any[]>([]);
const minuteOptions = ref<any[]>([]);
const hours = ref<any[]>([]);

const init = () => {
  hourOptions.value = [];
  const minTime = props.includeMin
    ? props.min < 1
      ? props.min
      : props.min - 1
    : props.min;
  const maxTime = props.includeMax
    ? props.max > 23
      ? props.max
      : props.max + 1
    : props.max;
  hours.value = range(minTime, maxTime);

  hourOptions.value = hours.value.map((hour) => {
    if (hour < 10) {
      hour = "0" + hour;
    }
    return `${hour}`;
  });
};

const range = (start: any, stop: any, step = 1) => {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
};

const initOptions = (length: number) => {
  const options = Array.from({ length: length }, (_, index) => {
    return index < 10 ? "0" + index : index.toString();
  });

  return options.filter((item: any) => item % props.minuteUnit === 0);
};

// 확인 버튼
const handleOkBtn = () => {
  let setTime = time.value.hour + ":" + time.value.minute;
  orgTime.value.hour = time.value.hour;
  orgTime.value.minute = time.value.minute;
  show.value = false;
  emit("input", setTime);
  emit("close");
};

// 취소 버튼
const handleCancle = () => {
  show.value = false;
  time.value.hour = orgTime.value.hour;
  time.value.minute = orgTime.value.minute;
  emit("close", null);
};

init();
minuteOptions.value = initOptions(60);
if (props.value) {
  const valueList = props.value ? props.value.split(":") : ["00", "00"];
  // 입력된 값 설정
  time.value.hour = valueList[0];
  time.value.minute = valueList[1];
  orgTime.value.hour = valueList[0];
  orgTime.value.minute = valueList[1];
}
</script>

<style lang="scss" scoped>
$dark: #1f1f1f;
$gray: #74788d;
.custom-time-picker-content {
  .title-text {
    background-color: rgba($gray, 0.2);
  }
  .time-list-item {
    font-weight: 400;
    cursor: pointer;

    &.active {
      // color: #ef4118;
      font-weight: bold;
      background-color: rgba($dark, 0.2);
    }
    &:hover {
      background-color: rgba($dark, 0.2);
    }
  }
}
</style>
