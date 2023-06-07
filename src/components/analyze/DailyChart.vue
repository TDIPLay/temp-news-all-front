<template>
  <div
    ref="chartEl"
    :id="`echartEl_${props.id}`"
    class="echartEl_wrap"
    style="height: 300px; max-width: 100%"
  ></div>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/store/common";
import * as echarts from "echarts";
import { onMounted, ref, nextTick, onUnmounted, watch, reactive } from "vue";

const props = defineProps(["data", "loading", "id", "isActive", "toolbox"]);
const chartEl = ref(null);
let myChart = reactive<any>(null);
const series = ref<any[]>([]);
type EChartsOption = echarts.EChartsOption;

const option = ref<EChartsOption>();
watch(
  () => props.isActive,
  (newVal, prevVal) => {
    if (newVal && !prevVal) {
      if (!myChart) return;

      nextTick(() => {
        myChart.resize();
      });
    }
  }
);
const setCahrtData = () => {
  nextTick(() => {
    myChart = null;

    if (!chartEl.value) return;
    myChart = echarts.init(chartEl.value as HTMLElement);
    if (myChart !== null && myChart !== undefined) {
      myChart.dispose();
    }

    myChart = echarts.init(chartEl.value);
    let toolbox = props.toolbox
      ? {
          magicType: {
            type: [...props.toolbox],
          },
        }
      : null;
    option.value = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: props.data.legend,
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
      },

      toolbox: {
        show: true,
        feature: {
          ...toolbox,
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: props.data.xAxis,
        axisLabel: {
          formatter: (value: string) => {
            const arr = value.split("-");
            return `${arr[1]}-${arr[2]}`;
          },
        },
      },
      yAxis: {
        type: "value",
      },
      series: props.data.series ?? [],
    };
    option.value && myChart.setOption(option.value);

    window.addEventListener("resize", function () {
      if (!myChart) return;
      // console.log(myChart);
      myChart.resize();
    });
  });
};
onMounted(() => {
  setCahrtData();
});

onUnmounted(() => {
  window.addEventListener("resize", () => {});
});
</script>
<style lang="scss">
.echartEl_wrap {
  margin: 0 !important;
  overflow: visible;
  & > div:first-child {
    position: initial !important;
    max-width: 95%;
    margin: 0 auto !important;
    canvas {
      max-width: 100%;
    }
  }
  & > div:last-child {
    position: absolute !important;
  }
}
</style>
