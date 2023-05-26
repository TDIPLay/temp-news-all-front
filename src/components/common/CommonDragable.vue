<template>
  <VueDraggableNext
    class="dragArea"
    :list="props.listItem"
    :group="{ name: `d-group${props.depth}` }"
  >
    <div
      v-for="(element, idx) in props.listItem"
      :key="idx"
      class="drag_list_item_wrap"
      :class="{
        main_title: !props.depth,
      }"
    >
      <div class="row drag_list_item m-0 pe-1 py-2 align-items-center">
        <div class="col-auto drag_list_item_left p-0">
          <i dense class="ps-1 mdi mdi-dots-grid font-size-16"> </i>
        </div>

        <div class="col p-1 overflow-text">
          <template v-if="props.readonly">
            <div
              class="overflow-text font-size-12"
              style="width: 90%"
              v-html="element[props.titleKey]"
            ></div>
          </template>
          <template v-else>
            <input
              v-model="element[props.titleKey]"
              class="custom_input_box"
              type="text"
            />
          </template>
        </div>

        <div class="col-auto drag_list_item_right py-0">
          <div class="row btn_list m-0">
            <button
              v-if="props.depth"
              falt
              class="btn"
              @click="
                emit('delete', {
                  group_no: element['group_no'] ? element['group_no'] : '',
                  index: idx,
                  item: element,
                })
              "
            >
              <i class="mdi mdi-trash-can-outline"></i>
            </button>
            <template v-else>
              <button
                falt
                class="btn"
                @click="
                  emit('delete-group', {
                    group_no: element['group_no'] ? element['group_no'] : '',
                    index: idx,
                    item: element,
                  })
                "
              >
                <i class="mdi mdi-trash-can-outline"></i>
              </button>
            </template>
          </div>
          <div class="col row text_list m-0 align-items-center text-caption">
            <template v-if="element.press_name">
              <span class="col text-caption pe-1 overflow-text">
                {{ element.press_name }}
              </span>
              <span class="text-caption pe-1 col-auto">|</span>
            </template>
            <span class="text-caption col-auto">
              {{ moment(element.pub_date).format("YYYY-MM-DD") }}
            </span>
          </div>

          <!-- <slot :name="`d-group${props.depth}-right`"></slot> -->
        </div>
      </div>

      <hr :class="props.depth == 0 ? 'thick' : ''" class="m-0" />

      <div class="drag_list_item_content">
        <CommonDragable
          :listItem="element[props.childrenKey]"
          :title-key="
            props.childrenTitleKey ? props.childrenTitleKey : props.titleKey
          "
          :readonly="
            props.childrenReadonly ? props.childrenReadonly : props.readonly
          "
          :depth="props.depth + 1"
          @delete="
            (val:any) =>
              emit('delete', {
                ...val,
                group_no: element['group_no'] ? element['group_no'] : '',
              })
          "
        />
      </div>
      <span
        v-if="props.depth == 0"
        flat
        dense
        class="btn btn-text"
        @click="showAddReportModal = Number(element['group_no'])"
        color="#e"
      >
        <i class="mdi mdi-plus"></i>
        기사 추가
      </span>
      <AddReortModal
        v-if="showAddReportModal === Number(element['group_no'])"
        :group-no="element['group_no']"
        :group-name="element[props.titleKey]"
        @cancle="showAddReportModal = 0"
        @submit="
          (reportInfo:any) =>
            addReport({
              group_no: element['group_no'] ? element['group_no'] : '',
              report: reportInfo,
            })
        "
      />
    </div>
  </VueDraggableNext>
</template>

<script setup lang="ts">
import { VueDraggableNext } from "vue-draggable-next";
import { ref } from "vue";
import CommonDragable from "./CommonDragable.vue";
import moment from "moment";
import AddReortModal from "@/components/briefing/AddReortModal.vue";

const props = defineProps({
  listItem: {
    type: Array,
    default: () => [] as any[],
  },
  titleKey: {
    type: String,
    required: false,
    default: "title",
  },
  childrenKey: {
    type: String,
    required: false,
    default: "children",
  },
  childrenTitleKey: {
    type: String,
    required: false,
    default: "children",
  },
  childrenReadonly: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  depth: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (e: "delete", value?: any): void;
  (e: "delete-group", value?: any): void;
  (e: "add-report", value?: any): void;
}>();

const showAddReportModal = ref<number>(-1);

const addReport = (addInfo: any) => {
  console.log("addReport", addInfo);
  emit("add-report", addInfo);
  showAddReportModal.value = -1;
};
</script>

<style lang="scss" scoped>
.dragArea {
  $primary: #556ee6;
  .text-caption {
    span {
      display: inline-block;
      font-size: 11px;
      line-height: 11px;
      max-width: 100px;
    }
  }

  .btn.btn-text {
    font-weight: bold;
    &:hover {
      color: $primary;
    }
  }
  .drag_list_item_wrap {
    // display: flex;
    // flex-direction: column;
  }
  .main_title {
    width: 100%;
    & > .drag_list_item > .col {
      .custom_input_box {
        font-weight: 600;
      }
    }
  }
  .drag_list_item {
    display: flex;
    cursor: pointer;

    .btn_list {
      width: 30px;
      text-align: right;
      button {
        padding: 0;
        min-width: 35px;
      }
      display: none;
    }
    .text_list {
      display: flex;
    }

    &:hover {
      background-color: rgba($primary, 0.1);
      color: $primary;
      .drag_list_item_left {
        i.mdi {
          display: inline-flex;
        }
      }
      .btn_list {
        display: block;
      }
      .text_list {
        display: none;
      }
    }
  }
  .drag_list_item_left {
    width: 22px;
    i.mdi {
      display: none;
    }
  }

  .drag_list_item_content {
    display: block;
  }
  hr {
    border: 1px solid #a4aab1;
    &.thick {
      border: 2px solid #000;
    }
  }
}
</style>
