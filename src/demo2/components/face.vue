<template>
  <g>
    <path
      :d="faceData2PathD"
      stroke="red"
      fill="none"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
    />
    <path
      :d="cursorPathD"
      stroke="red"
      fill="none"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
    />
    <path
      :d="closurePathD"
      stroke="red"
      fill="none"
      stroke-width="1"
      vector-effect="non-scaling-stroke"
      stroke-dasharray="5, 5"
    />
  </g>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, toRefs } from "vue";
import { faceData } from "../state.ts";
import { bool, object } from "vue-types";
import { useCurrentElement, useMouse, useParentElement } from "@vueuse/core";
// 是否绘制中
const props = defineProps({
  isDrawing: bool().def(false),
  cursor: object<Record<'x' | 'y', number>>().def({ x: 0, y: 0 }),
});
const { isDrawing } = toRefs(props);

// 面
const faceData2PathD = computed(() => {
  if (faceData.value.size === 0) return "";
  let path = Array.from(faceData.value)
    .map((p) => `L${p.x} ${p.y}`)
    .join(" ");
  path = "M" + path.substring(1);
  return path;
});

// 闭合线
const closurePathD = computed(() => {
  if (faceData.value.size === 0) return "";
  const points = Array.from(faceData.value);
  const start = points.at(0);
  const end = points.at(-1);
  let path = `M${start.x} ${start.y} L${end.x} ${end.y}`;
  return path;
});

// 面终点与鼠标位置连线
const cursorPathD = computed(() => {
  if (faceData.value.size === 0 || !isDrawing.value) return "";
  const points = Array.from(faceData.value);
  const start = points.at(-1);
  let path = `M${start.x} ${start.y} L${props.cursor.x} ${props.cursor.y}`;
  return path;
});
</script>
