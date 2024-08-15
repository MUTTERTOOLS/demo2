<template>
  <g>
    <line
      stroke="black"
      fill="none"
      :stroke-width="isHovered ? 3 : 1"
      vector-effect="non-scaling-stroke"
      stroke-dasharray="1, 5"
      :x1="x1"
      :y1="y1"
      :x2="x2"
      :y2="y2"
    >
    </line>
    <rect
      :x="rectAttributes.x"
      :y="rectAttributes.y"
      :width="rectAttributes.width"
      :height="rectAttributes.height"
      :transform="rectAttributes.transform"
      fill="transparent"
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
import { isHorizontal, isVertical } from "../utils";

const el = useCurrentElement() as Ref<Element>;
const props = defineProps({
  auxiliary: object<Auxiliary>(),
});
const isHovered = useElementHover(el, {
  delayEnter: 0,
  delayLeave: 0,
});
const { A, B, C } = toRefs(props.auxiliary);
const MIN_X = -10000;
const MAX_X = 10000;
const MIN_Y = -10000;
const MAX_Y = 10000;

const x1 = computed(() => {
  return isVertical(props.auxiliary) ? -C.value / A.value : MIN_X;
});
const x2 = computed(() => {
  return isVertical(props.auxiliary) ? -C.value / A.value : MAX_X;
});
const y1 = computed(() => {
  return isVertical(props.auxiliary)
    ? MIN_Y
    : caculateCoordinate(props.auxiliary, "x", MIN_X);
});
const y2 = computed(() => {
  return isVertical(props.auxiliary)
    ? MAX_Y
    : caculateCoordinate(props.auxiliary, "x", MAX_X);
});
const rectAttributes = computed(() => useCreateRectOccupation(props.auxiliary));

useEventListener(el, "mousedown", (event) => {
  event.stopPropagation();
});

interface RectAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
  transform?: string;
}
// 计算用于占位的矩形
function useCreateRectOccupation(auxiliary: Auxiliary): RectAttributes {
  const RectOffset = 10;
  const { A, B, C } = auxiliary;

  if (isVertical(auxiliary)) {
    return {
      x: -C / A - RectOffset / 2,
      y: MIN_Y,
      width: RectOffset,
      height: Math.abs(MIN_Y) + Math.abs(MAX_Y),
    };
  } else {
    const t = Math.atan(-A / B);
    const degree = (t / Math.PI) * 180;
    const x = MIN_X;
    const y = caculateCoordinate(auxiliary, "x", x);
    return {
      x,
      y: y - RectOffset / 2,
      width: Math.abs(MIN_X) + Math.abs(MAX_X) / Math.cos(t),
      height: RectOffset,
      transform: `rotate(${degree}, ${x}, ${y})`,
    };
  }
}

function caculateCoordinate(
  auxiliary: Auxiliary,
  axis: "y" | "x",
  value: number
) {
  const { A, B, C } = auxiliary;
  if (axis === "y") {
    return -(B * value + C) / A;
  } else {
    return -(A * value + C) / B;
  }
}
</script>
