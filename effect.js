export let activeEffect


export default function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除工作
    cleanup(effectFn)  // 新增
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}

// 用于清空当前已有依赖
function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合
    const dep = effectFn.deps[i]
    // 将 effectFn 从依赖集合中移除
    dep.delete(effectFn)
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0
}