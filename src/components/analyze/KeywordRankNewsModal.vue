<template>
  <b-modal
    v-model="showModal"
    centered
    size="md"
    :title="`${props.type > 0 ? '긍정' : '부정'} 키워드 관련 기사`"
    hide-footer
    @close="emit('close')"
    bodyClass="p-0"
    no-close-on-esc
    no-close-on-backdrop
  >
    <div class="card-body py-2 d-flex-column">
      <div class="px-2" style="height: 70vh; max-height: 600px; overflow: auto">
        <SemiCardItem
          v-for="(news, index) in props.newsList"
          :key="index"
          :index="index"
          :news-data="news"
          :id="news.news_no"
        />
      </div>
      <div class="col text-center px-3 pt-3">
        <button class="w-100 btn btn-primary px-4" @click="emit('more')">
          <i class="mdi mdi-plus"></i>
          더 보기
        </button>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { useCommonStore } from "@/store/common";
import { ref, reactive, nextTick } from "vue";
import SemiCardItem from "@/components/analyze/SemiCardItem.vue";

const { loading } = useCommonStore();
const props = defineProps({
  type: {
    type: String || Number,
    default: "",
  },
  newsList: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "close", value?: any): void;
  (e: "more", value?: any): void;
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

<style lang="scss" scoped></style>
