<template>
  <button @click="drawHorizontalAuxi">水平辅助线</button>
  <button @click="drawVerticalAuxi">垂直辅助线</button>
  <button @click="drawFace">绘制面</button> 
  <button @click="save">保存</button> 
  <button @click="importBox">导入</button> 
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
      <path
        :d="auxiliaryLinesPathD"
        stroke="black"
        fill="none"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="1, 5"
      />

      <g>
        <path
          :d="facePathD"
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

      <g ref="intersection">
        <circle
          v-for="[key, p] in intersectionsMap"
          :key="key"
          :cx="p.x"
          :cy="p.y"
          r="4"
          :point="key"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useEventListener, onKeyDown } from "@vueuse/core";
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  reactive,
  customRef,
  watch,
} from "vue";
import StraightLine from "./StraightLine";
import Point from "./Point";
import * as math from "mathjs";
import { boxAttributes, boxFormula } from "./params.ts";
enum Direction {
  horizontal = "horizontal",
  vertical = "vertical",
  inclined = "inclined",
}
const intersection = ref<HTMLElement>();

const auxiliaryLines = ref<StraightLine[]>([]);
const auxiliaryLinesPathD = computed(() => {
  return auxiliaryLines.value
    .map((line) => {
      if (Number.isFinite(line.k))
        return `M${-10000} ${line.k * -10000 + line.b} L${10000} ${
          line.k * 1000 + line.b
        }`;
      else return `M${-line.C} ${-10000} L${-line.C} ${10000}`;
    })
    .join(" ");
});
const intersectionsMap = new Map<string, Point>();
const face = ref(new Set<Point>());
const facePathD = computed(() => {
  if (face.value.size === 0) return "";
  let path = Array.from(face.value)
    .map((p) => `L${p.x} ${p.y}`)
    .join(" ");
  path = "M" + path.substring(1);
  return path;
});
const closurePathD = computed(() => {
  if (face.value.size === 0) return "";
  const points = Array.from(face.value);
  const start = points.at(0);
  const end = points.at(-1);
  let path = `M${start.x} ${start.y} L${end.x} ${end.y}`;
  return path;
});
const cursorPosition = ref({ x: 0, y: 0 });
const isDrawing = ref(false);
const cursorPathD = computed(() => {
  if (face.value.size === 0 || !isDrawing.value) return "";
  const points = Array.from(face.value);
  const start = points.at(-1);
  let path = `M${start.x} ${start.y} L${cursorPosition.value.x} ${cursorPosition.value.y}`;
  return path;
});

function drawAuxiliary(A: number, B: number, formula: string) {
  const line = new StraightLine(A, B, formula);
  const straightLine = reactive(line);
  auxiliaryLines.value.push(line);
  getIntersections(straightLine);
  // const line =
  //   direction === Direction.vertical
  //     ? new StraightLine(1, 0, 0)
  //     : new StraightLine(0, 1, 0);
  // const direction = A === 0 ? Direction.horizontal : B === 0 ? Direction.vertical : Direction.inclined
  // removeIntersections(straightLine);

  // const clear = watch(straightLine, () => {
  //   console.log('move')
  //   removeIntersections(straightLine);
  //   getIntersections(straightLine);
  // }, {immediate: true, flush: 'sync'});

  // const clearMousemove = useEventListener(container, "mousemove", draw);
  // const clearClick = useEventListener(container, "click", () => {
  //   clear();
  //   clearMousemove();
  //   clearClick();
  // });

  // function draw(event) {
  //   if (!auxiliaryLines.value.includes(straightLine))
  //     auxiliaryLines.value.push(line);

  //   const { clientX, clientY } = event;
  //   if (direction === Direction.horizontal) {
  //     straightLine.C = -(clientY - container.value.offsetTop);
  //   } else if (direction === Direction.vertical) {
  //     straightLine.C = -(clientX - container.value.offsetLeft);
  //   } else if (direction === Direction.inclined) {
  //     straightLine.A = clientY - container.value.offsetTop;
  //     straightLine.B = clientX - container.value.offsetLeft;
  //   }
  // }
}

function removeAuxiliary(line: StraightLine) {
  removeIntersections(line);
  auxiliaryLines.value = auxiliaryLines.value.filter((item) => item !== line);
}

function getIntersections(line: StraightLine) {
  for (let i = 0; i < auxiliaryLines.value.length; i++) {
    const auxiliaryLine = auxiliaryLines.value[i];
    if (auxiliaryLine.k === line.k && auxiliaryLine.b === line.b) continue;

    const { A: A1, B: B1, C: C1 } = line;
    const { A: A2, B: B2, C: C2 } = auxiliaryLine;
    const coefficient = [
      [A1, B1],
      [A2, B2],
    ];
    const constant = [-C1, -C2];
    try {
      const [[x], [y]] = math.lusolve(coefficient, constant) as [
        [number],
        [number]
      ];
      const key = `${x},${y}`;

      const intersection = intersectionsMap.has(key)
        ? intersectionsMap.get(key)
        : new Point(x, y);
      intersection.lines.add(line);
      intersection.lines.add(auxiliaryLine);

      intersectionsMap.set(key, intersection);
    } catch (error) {
      // console.warn('交点不存在');
    }
  }
}
function caculateIntersection(line1: StraightLine, line2: StraightLine) {
    const { A: A1, B: B1, C: C1 } = line1;
    const { A: A2, B: B2, C: C2 } = line2;
    const coefficient = [
      [A1, B1],
      [A2, B2],
    ];
    const constant = [-C1, -C2];
    try {
      const [[x], [y]] = math.lusolve(coefficient, constant) as [
        [number],
        [number]
      ];
      return new Point(x, y);

    } catch (error) {
      // console.warn('交点不存在');
    }
}
function removeIntersections(line: StraightLine) {
  Array.from(intersectionsMap.entries()).forEach(([key, intersection]) => {
    if (intersection.lines.has(line)) {
      if (intersection.lines.size === 2) {
        intersectionsMap.delete(key);
      } else {
        intersection.lines.delete(line);
      }
    }
  });

  function splitKey(key: string) {
    const [x, y] = key.split(",");
    return new Point(Number(x), Number(y));
  }
}
function drawFace() {
  // console.log(face, intersection);
  isDrawing.value = true;
  const clearMousedown = useEventListener(intersection, "mousedown", (event) => {
    // event.preventDefault();
    event.stopPropagation();
  })
  const clearClick = useEventListener(intersection, "click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const { target } = event;
    // @ts-ignore
    const point = intersectionsMap.get(target.getAttribute("point"));
    face.value.add(point);
    console.log("add point into face");
  });

  const clearMousemove = useEventListener(container, "mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorPosition.value = new Point(
      clientX - container.value.offsetLeft - translateX.value,
      clientY - container.value.offsetTop - translateY.value
    );
  });

  const clearKeydown = onKeyDown("Escape", (e) => {
    e.preventDefault();
    isDrawing.value = false;
    clearClick();
    clearMousemove();
    clearKeydown();
  });
}
function drawHorizontalAuxi() {
  const formula = prompt();
  drawAuxiliary(0, 1, formula);
}
function drawVerticalAuxi() {
  const formula = prompt();
  drawAuxiliary(1, 0, formula);
}
function save() {
  if (face.value.size < 3) throw new Error("face must have at least 3 points");
  const formula = boxFormula.value;
  const points = Array.from(face.value.values());
  let data = points
    .map((point) => {
      return serializePoint(point);
    })
    .join(",");
  data = `_face(${data})`;
  const result = JSON.stringify({
    formula,
    data,
  });
  // alert(result);
  console.log(result.toString());
  return result;

  function serializePoint(point: Point) {
    const [line1, line2] = point.lines;
    return `_point(${serializeStraightLine(line1)},${serializeStraightLine(
      line2
    )})`;
  }
  function serializeStraightLine(line: StraightLine) {
    return `_line(${line.A},${line.B},\"${line.formula}\")`;
  }
}

function importBox() {
  const { formula, data } = JSON.parse(prompt()) as any;
  console.log(formula, data);

  const context = {_line, _point, _face};
  const lineCache = new Map<string, StraightLine>();
  const pointCache = new Map<string, Point>();

  boxFormula.value = formula;
  Object.setPrototypeOf(context, boxAttributes.value);
  const result = (new Function(`with(this){return ${data}}`).call(context))
  face.value = new Set(result);
  console.log(111);

  function _line(A: number, B: number, formula: string) {
    const key = `${A},${B},${formula}`;
    if (lineCache.has(key)) return lineCache.get(key);

    const straightLine = new StraightLine(A, B, formula);
    lineCache.set(key, straightLine);
    auxiliaryLines.value.push(straightLine);
    return straightLine;
  }
  function _point(line1: StraightLine, line2: StraightLine) {
    const p = caculateIntersection(line1, line2);
    const { x, y } = p;
    const key = `${x},${y}`;
    if (pointCache.has(key)) return pointCache.get(key);

    pointCache.set(key, p);
    intersectionsMap.set(`${x},${y}`, p);
    return p;
  }
  function _face(...points: Point[]) {
    return points;
  }
}
function exportPositon() {
  console.log(facePathD.value + ' Z');
}


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
