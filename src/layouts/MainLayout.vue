<template>
  <div style="position: relative">
    <VerticalLayout
      v-if="layoutType === 'vertical'"
      :layout="layoutType"
      @content-scroll="(event:Event) => emit('content-scroll', event)"
    >
      <slot />
    </VerticalLayout>

    <HorizontalLayout
      v-if="layoutType === 'horizontal'"
      :layout="layoutType"
      @content-scroll="(event:Event) =>emit('content-scroll', event)"
    >
      <slot />
    </HorizontalLayout>
  </div>
</template>

<script setup lang="ts">
import { useHelperStore } from "@/store/helper";
import VerticalLayout from "@/layouts/VerticalLayout.vue";
import HorizontalLayout from "@/layouts/HorizontalLayout.vue";

const emit = defineEmits<{
  (e: "content-scroll'", value?: any): void;
}>();
const { layoutType } = useHelperStore();
</script>
