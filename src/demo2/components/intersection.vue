<template>
  <g>
    <circle :cx="intersection.x" :cy="intersection.y" r="4" :fill="color" />
    <circle
      :cx="intersection.x"
      :cy="intersection.y"
      r="6"
      fill="transparent"
      stroke-width="2"
      :stroke="outerColor"
    />
  </g>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch, toRefs } from "vue";
import { object } from "vue-types";
import {
  useCurrentElement,
  useElementHover,
  useEventListener,
} from "@vueuse/core";
import { eventControllerOption, eventController } from "../eventController";
import { selectedIntersections } from "../state";

const el = useCurrentElement() as Ref<HTMLElement>;
const isHovered = useElementHover(el);
const props = defineProps({
  intersection: object<Point>(),
});
const color = computed(() =>
  selectedIntersections.value.includes(props.intersection)
    ? "#d9363e"
    : isHovered.value
    ? "#1677ff"
    : "black"
);
const outerColor = computed(() =>
  selectedIntersections.value.includes(props.intersection)
    ? "#d9363e"
    : isHovered.value
    ? "#1677ff"
    : "transparent"
);

let clearEvent: () => void;
watch(
  eventControllerOption,
  () => {
    clearEvent && clearEvent();
    clearEvent = eventController.value.bindEvents(el, "intersection", {
      click: [props.intersection],
    });
  },
  {
    immediate: true,
  }
);

useEventListener(el, "mousedown", (event) => {
  event.stopPropagation();
});
</script>
