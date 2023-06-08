<template>
  <div
    ref="chartEl"
    :id="`echartEl_${props.id}`"
    class="echartEl_wrap"
    style="height: 300px; max-width: 100%"
  ></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref, nextTick, onUnmounted, watch, reactive } from "vue";

const props = defineProps([
  "data",
  "loading",
  "id",
  "isActive",
  "toolbox",
  "tooltip",
]);
const chartEl = ref(null);
let myChart = reactive<any>(null);
type EChartsOption = echarts.EChartsOption;
const countryColors = ["52, 195, 143", "244, 106, 106", "241, 180, 76"];
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

    let optionData = [...props.data.series];

    if (props.data?.series_angle == 180) {
      let tempVal = 0;
      optionData.map((item) => (tempVal += item.value));

      optionData.push({
        value: tempVal,
        itemStyle: {
          color: "none",
          decal: {
            symbol: "none",
          },
        },
        label: {
          show: false,
        },
      });
    }

    option.value = {
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
      tooltip: {
        trigger: "item",
        ...props?.tooltip,
      },
      legend: {
        left: "center",
        top: "bottom",
        data: props.data.series?.map((item: any) => item.name) ?? [],
      },
      series: {
        type: "pie",
        radius: props.data?.series_radius ?? ["25%", "70%"],
        center: props.data?.series_center ?? ["50%", "45%"],
        startAngle: props.data?.series_angle ?? 90,
        label: props.data?.series_label ?? {
          show: true,
        },
        itemStyle: {
          borderRadius: 5,
          color: function (param: any) {
            return `rgba(${
              countryColors[param.dataIndex] || "84, 112, 198"
            }, 0.8)`;
          },
        },
        data: optionData,
      },
    };
    // console.log(option.value);

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
  & > div {
    position: initial !important;
    max-width: 95%;
    margin: 0 auto !important;
    canvas {
      max-width: 100%;
    }
  }
}
</style>
