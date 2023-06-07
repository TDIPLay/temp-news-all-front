<template>
  <apexchart
    class="apex-charts"
    height="260"
    type="donut"
    dir="ltr"
    :series="donutChart.series"
    :options="donutChart.chartOptions"
  ></apexchart>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";

const props = defineProps(["data", "loading", "id", "isActive"]);
const donutChart = reactive({
  series: [] as any[],
  chartOptions: {
    labels: [] as any[],
    colors: [
      "rgba(52, 195, 143, 0.7)",
      "rgba(244, 106, 106, 0.8)",
      "rgba(241, 180, 76, 0.8) ",
    ],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 150,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  },
});
if (props.data) {
  donutChart.series = [...props.data.series] ?? [];
  donutChart.chartOptions.labels = [...props.data.legend] ?? [];
}

// watch(
//   () => props.isActive,
//   (newVal, prevVal) => {
//     if (newVal && !prevVal) {
//       if (!myChart) return;

//       nextTick(() => {
//         myChart.resize();
//       });
//     }
//   }
// );
// const setCahrtData = () => {
//   nextTick(() => {
//     myChart = null;

//     if (!chartEl.value) return;
//     myChart = echarts.init(chartEl.value as HTMLElement);
//     if (myChart !== null && myChart !== undefined) {
//       myChart.dispose();
//     }

//     myChart = echarts.init(chartEl.value);

//     option.value = {
//       tooltip: {
//         trigger: "axis",
//         axisPointer: {
//           type: "shadow",
//         },
//       },
//       legend: {
//         data: props.data.legend,
//       },
//       grid: {
//         left: "5%",
//         right: "5%",
//         bottom: "15%",
//       },
//       toolbox: {
//         show: true,
//         feature: {
//           saveAsImage: {},
//         },
//       },
//       xAxis: {
//         type: "category",
//         boundaryGap: false,
//         data: props.data.xAxis,
//         axisLabel: {
//           formatter: (value: string) => {
//             const arr = value.split("-");
//             return `${arr[1]}-${arr[2]}`;
//           },
//         },
//       },
//       yAxis: {
//         type: "value",
//       },
//       series: props.data.series ?? [],
//     };
//     // console.log(option.value);

//     option.value && myChart.setOption(option.value);

//     window.addEventListener("resize", function () {
//       if (!myChart) return;
//       // console.log(myChart);
//       myChart.resize();
//     });
//   });
// };
// onMounted(() => {
//   setCahrtData();
// });

// onUnmounted(() => {
//   window.addEventListener("resize", () => {});
// });
</script>
<style lang="scss">
// .echartEl_wrap {
//   margin: 0 !important;
//   overflow: hidden;
//   & > div {
//     max-width: 95%;
//     margin: 0 auto !important;
//     canvas {
//       max-width: 100%;
//     }
//   }
// }
</style>
