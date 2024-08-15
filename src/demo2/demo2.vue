<template>
  <button @click="drawHorizontalAuxi">水平辅助线</button>
  <button @click="drawVerticalAuxi">垂直辅助线</button>
  <button @click="drawAuxiWithDoublePoints">两点成线</button>
  <button @click="drawAngleAuxiliary">角度成线</button>
  <!-- <button @click="drawCircle">圆</button> -->
  <button @click="drawFace">绘制面</button> 
  <button @click="save">保存</button>  <button @click="importBox">导入</button> 
  <button @click="exportPositon">输出点坐标</button> 

  <div ref="container" class="svg-container">
    <svg
      :width="width"
      :height="height"
      :viewBox="viewBox"
      @mousedown="startDrag"
    >
      <!-- SVG 内容 -->
      <path
        d="M0 50 L0 0 L50 0 M0 0 L40 40"
        stroke="black"
        fill="none"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
      <g>
        <auxiliary
          v-for="(auxiliary, index) in auxiliaryLines"
          :auxiliary="auxiliary"
          :key="index"
        ></auxiliary>
      </g>

      <!-- <g>
        <path
          :d="face2PathD"
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
      </g> -->

      <g>
        <face :is-drawing="isDrawing" :cursor="cursor"></face>
      </g>

      <g>
        <intersection
          v-for="inters in intersections"
          :intersection="inters"
        ></intersection>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useEventListener, onKeyDown, useMouse } from "@vueuse/core";
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  reactive,
  customRef,
  watch,
} from "vue";

import { boxAttributes, boxFormula } from "../params.ts";
import {
  createAuxiliaryWithPoints,
  createHorizontalAuxiliary,
  createIntersection,
  createVerticalAuxiliary,
} from "./factory.ts";
import factory from "./factory.ts";
import { setEvent } from "./eventController/index.ts";

// 组件
import auxiliary from "./components/auxiliary.vue";
import intersection from "./components/intersection.vue";
import face from "./components/face.vue";

// 数据
import { auxiliaryLines, drawAuxiliary } from "./hooks/useAuxiliary.ts";
import {
  intersectionsDep,
  intersectionsMap,
  intersections,
} from "./hooks/useIntersection.ts";
import { faceData } from "./state.ts";

const isDrawing = ref(false);
// 鼠标位于文档中的位置
const mouse = useMouse({ touch: false });
// 鼠标位于画布中的位置
const cursor = computed(() => {
  if (container.value)
    return {
      x: mouse.x.value - container.value.offsetLeft - translateX.value,
      y: mouse.y.value - container.value.offsetTop - translateY.value,
    };
});
function drawFace() {
  isDrawing.value = true;
  setEvent("face");

  const clearKeydown = onKeyDown("Escape", (e) => {
    e.preventDefault();
    isDrawing.value = false;
    clearKeydown();
    setEvent("default");
  });
}
function drawHorizontalAuxi() {
  setEvent("drawHorizontalAuxi");
  const formula = prompt();
  drawAuxiliary(createHorizontalAuxiliary(formula));
}
function drawVerticalAuxi() {
  setEvent("drawVerticalAuxi");
  const formula = prompt();
  drawAuxiliary(createVerticalAuxiliary(formula));
}
function drawAuxiWithDoublePoints() {
  setEvent("connect");
}
function drawAngleAuxiliary() {
  setEvent("angle");
}
function drawCircle() {
  // setEventController(drawCircleOption);
}

function save() {
  if (faceData.value.size < 3)
    throw new Error("face must have at least 3 points");

  const formula = boxFormula.value; // 盒型参数
  const points = Array.from(faceData.value.values()); // 构成面的点集合

  let data = points
    .map((p) => p.serialize()) // 递归调用序列化方法
    .join(",");
  data = `getFaceData(${data})`;

  // 生成 JSON 产物
  const result = JSON.stringify({
    formula,
    data,
  });
  console.log(result.toString());
  return result;
}

function importBox() {
  const { formula, data } = JSON.parse(prompt()) as any;
  boxFormula.value = formula;

  console.log(formula, data);

  const context = Object.assign({ drawAuxiliary }, factory);

  const result = new Function(`with(this){return ${data}}`).call(
    context
  ) as Point[];
  result.forEach((_) => faceData.value.add(_));
}
function exportPositon() {
  console.log(faceData2PathD.value);
}
const faceData2PathD = computed(() => {
  if (faceData.value.size === 0) return "";
  let path = Array.from(faceData.value)
    .map((p) => `L${p.x} ${p.y}`)
    .join(" ");
  path = "M" + path.substring(1) + "Z";
  return path;
});

const container = ref<HTMLDivElement>(null);
const width = 10000;
const height = 10000;
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const startX = ref(0);
const startY = ref(0);

let dragging = false;

// 计算 viewBox
const viewBox = computed(() => {
  return `${-translateX.value} ${-translateY.value} ${width * scale.value} ${
    height * scale.value
  }`;
});

// 滚轮缩放
function handleWheel(event) {
  const delta = event.deltaY;
  const factor = Math.pow(1.1, delta / 200);
  scale.value *= factor;
}

// 鼠标事件
function startDrag(event) {
  dragging = true;
  startX.value = event.clientX;
  startY.value = event.clientY;
  useEventListener(container.value, "mousemove", drag);
}

function drag(event) {
  if (!dragging) return;
  translateX.value += (event.clientX - startX.value) / scale.value;
  translateY.value += (event.clientY - startY.value) / scale.value;
  startX.value = event.clientX;
  startY.value = event.clientY;
  useEventListener(container.value, "mouseup", endDrag);
}

function endDrag() {
  dragging = false;
}

// 添加和移除事件监听器
onMounted(() => {
  // container.value.addEventListener('wheel', handleWheel);
  useEventListener(container.value, "mousedown", startDrag);
});
</script>

<style scoped>
.svg-container {
  width: 80vw;
  height: 80vh;
  border: 1px solid #ccc;
  overflow: hidden;
  margin: 0 auto;
}
</style>
