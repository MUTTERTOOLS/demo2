<template>
  <div>
    <svg ref='svg' width="500" height="500" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" @wheel="wheel">
      <g transform="translate(0,0)">
        <g></g>
        <g transform="scale(1)"></g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
const svg = ref<SVGAElement>();
const isMouseDown = ref(false);
const mouseDownEvent = ref({clientX: 0, clientY: 0, isMouseDown: false});

function mousedown(e: MouseEvent) {
  // isMouseDown.value = true;
  const {clientX, clientY} = e;
  const {left , top} = e.target as SVGAElement;
  console.log(e.target);
  mouseDownEvent.value = {
    clientX, clientY, isMouseDown: true,
  }
  
  console.log('dowm');
}
function mouseup() {
  // isMouseDown.value = false;
  mouseDownEvent.value.isMouseDown = false;
}

function wheel(event) {
  // console.log(event);

  const svg = event.target;
  console.log(svg);
}

function mousemove(e: MouseEvent) {
  if(!isMouseDown.value) return;

  const svg = e.target;
  const {clientX, clientY} = e;

  console.log(svg);
}

// onMounted(() => {
//   // svg.value.appendChild(svg.node());
//   svg.value?.addEventListener('wheel', (event) => {
    
//   })
// })
</script>

<style scoped>

</style>