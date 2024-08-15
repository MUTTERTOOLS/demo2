import { activeEffect } from './effect.js'

let bucket = new WeakMap()

export default function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, reciever) {
      track(target, key)
      return target[key]
    },
    set(target, key, value, reciever) {
      target[key] = value
      trigger(target, key)
      return true
    }
  })
}

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}