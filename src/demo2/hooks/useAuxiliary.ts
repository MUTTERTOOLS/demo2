import { ref } from "vue";
import { isSameAuxiliary } from "../utils";
import { intersectionsDep, setIntersections } from "./useIntersection";

export const auxiliaryLines = ref<Auxiliary[]>([]);

export function drawAuxiliary(line: Auxiliary) {
  const sameAuxiliary = auxiliaryLines.value.find((auxiliary) =>
    isSameAuxiliary(line, auxiliary)
  );
  if (sameAuxiliary) return sameAuxiliary;

  setIntersections(line);
  auxiliaryLines.value.push(line);
  return line;
}

export function deleteAuxiliary(line: Auxiliary) {
  auxiliaryLines.value = auxiliaryLines.value.filter(
    (auxiliary) => line !== auxiliary
  );

  intersectionsDep.entries().forEach(([point, dep]) => {
    if (dep.has(line)) {
      // 删除交点依赖的辅助线
      dep.delete(line);

      // 如果交点所依赖的辅助线数量少于2，删除交点
      if (dep.size < 2) {
        intersectionsDep.delete(point);
      }
    }
  });
}
