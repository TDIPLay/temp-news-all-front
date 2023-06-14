<template>
  <div
    ref="chartEl"
    :id="`echartEl_${props.id}`"
    class="echartEl_wrap"
    style="height: 300px; max-width: 100%"
  ></div>
</template>

<script setup lang="ts">
import { CommonUtils } from "@/utils/CommonUtils";
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
      color: [
        "#70c7e2",
        "#f7cd61",
        "#74c94b",
        "#e66666",
        "#bb5fdb",
        "#5452d4",
        "#da893e",
        "#39d7b1",
        "#eb7cc5",
        "#835dd7",
        "#4e9af1",
        "#b2ad26",
        "#17b35f",
        "#f89055",
        "#7d47bd",
        "#7c3e10",
        "#16a4ad",
        "#27600d",
        "#cd2814",
        "#232749",
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: props.data.legend,
        bottom: 0,
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        containLabel: true,
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
    div {
      text-align: left;
    }
  }
}
</style>
