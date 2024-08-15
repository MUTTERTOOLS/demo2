import { createApp } from "vue";
// import "./style.css";
// import App from "./App.vue";
import App from "./App.vue";
createApp(App).mount("#app");

import { ref } from "vue";
import { LastArrayElement } from "type-fest";
import { number } from "mathjs";
import { Point } from "canvaskit-wasm";


/**
 * 创建一个反转操作的 hook。
 * @param {Function} fn - 要执行的操作。
 * @returns {Function} 一个可以撤销或反转 fn 操作的函数。
 */
function useReverseOperation<T extends any[], K>(
  fn: (ctx: K | undefined, ...args: T) => K,
  reverseFn: (arg: K) => void
) {
  let context: K;
  return function (...args: T) {
    function proxyFn() {
      context = fn(context, ...args);
      return proxyReverseFn;
    }
    function proxyReverseFn() {
      reverseFn(context);
      return proxyFn;
    }
    return proxyFn();
  };
}

// // test 1
// let count = 0;
// console.log(count);
// let fn = useReverseOperation(
//   () => count++,
//   () => count--
// )();
// console.log(count);
// fn = fn();
// console.log(count);
// fn = fn();
// console.log(count);

// // test 2
// class Test {
//   constructor(public a: number, public b: number) {}
// }
// let arr: Test[] = [];
// console.log(arr);
// let fn2 = useReverseOperation(
//   (ctx: Test | undefined, a: number, b: number) => {
//     const test = new Test(a, b);
//     arr.push(test);
//     return test;
//   },
//   (test) => {
//     arr = arr.filter((item) => item !== test);
//   }
// )(1, 2);
// console.log(arr);
// fn2 = fn2();
// console.log(arr);
// fn2 = fn2();
// console.log(arr);



