<template>
  <b-modal
    v-model="showModal"
    size="xl"
    centered
    title="구독 관리"
    hide-footer
    @close="emit('close')"
    no-close-on-esc
    no-close-on-backdrop
  >
    <div class="card-body">
      <h4 class="card-title p-3">구독하실 플랜을 선택해 주세요.</h4>
      <!-- 구독 상품 -->
      <div>
        <div class="row m-0">
          <div class="col-md-6 col-xl-3">
            <div class="card border p-3">
              <div class="card-title font-size-17">Standard</div>
              <div>
                <span class="font-size-11">매 월 / </span>
                <span class="font-size-15"> 200,000 ₩</span>
              </div>
              <ul class="ps-3 my-2">
                <li>좋은점 1번</li>
                <li>좋은점 2번</li>
                <li>좋은점 3번</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="card border p-3">
              <div class="card-title font-size-17">Professional</div>
              <div>
                <span class="font-size-11">매 월 / </span>
                <span class="font-size-15"> 300,000 ₩</span>
              </div>
              <ul class="ps-3 my-2">
                <li>좋은점 1번</li>
                <li>좋은점 2번</li>
                <li>좋은점 3번</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="card border p-3">
              <div class="card-title font-size-17">Enterprise</div>
              <div>
                <span class="font-size-11">매 월 / </span>
                <span class="font-size-15"> 550,000 ₩</span>
              </div>
              <ul class="ps-3 my-2">
                <li>좋은점 1번</li>
                <li>좋은점 2번</li>
                <li>좋은점 3번</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="card border p-3">
              <div class="card-title font-size-17">Unlimited</div>
              <div>
                <span class="font-size-11">매 월 / </span>
                <span class="font-size-15"> 850,000 ₩</span>
              </div>
              <ul class="ps-3 my-2">
                <li>좋은점 1번</li>
                <li>좋은점 2번</li>
                <li>좋은점 3번</li>
              </ul>
            </div>
          </div>
        </div>
        <div
          class="row m-0 justify-content-center align-items-center px-3 pt-3"
        >
          <div class="col-auto d-flex">
            <button
              class="btn btn-danger px-4"
              :class="{ disabled: loading }"
              @click="submit"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from "vue";
import { useCommonStore } from "@/store/common";

const { loading, showLoading, hideLoading } = useCommonStore();
const { showNoti } = useCommonStore();
const props = defineProps({
  id: {
    type: String || Number,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "close", value?: any): void;
  (e: "refresh", value?: any): void;
}>();

const options = reactive<{
  groupList: any[];
}>({
  groupList: [],
});

const showModal = ref(false);

nextTick(() => {
  showModal.value = true;
});
</script>

<style lang="scss" scoped>
$primary: #556ee6;
</style>
