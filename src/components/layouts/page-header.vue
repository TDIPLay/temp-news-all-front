<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div
        class="page-title-box d-flex align-items-center justify-content-between"
      >
        <h4 class="mb-0 font-size-18">
          <slot name="title">
            {{ props.title }}
          </slot>
        </h4>

        <div class="page-title-right">
          <slot name="right"> </slot>
          <b-breadcrumb
            v-if="props.items.length"
            :items="props.items"
            class="m-0 py-0"
          ></b-breadcrumb>
        </div>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>
