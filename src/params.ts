import { parseToFunc } from "./parser/parser2"
import {computed, ref} from 'vue';

export const boxFormula = ref({
  'L': '100',
  'W': 'L + 100'
})
const boxAttributesFunc = computed(() => {
  const obj = {}
  for (const key in boxFormula.value) {
    const formula = boxFormula.value[key]
    obj[key] = parseToFunc(formula)
  }
  return obj
})
export const boxAttributes = computed(() => {
  const obj = {}
  for (const key in boxAttributesFunc.value) {
    const fn = boxAttributesFunc.value[key]
    obj[key] = fn(obj)
  }
  return obj
})
console.log(boxAttributes)