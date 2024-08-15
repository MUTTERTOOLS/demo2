import { computed, reactive } from "vue";
import { auxiliaryLines } from "./useAuxiliary";
import { isSameAuxiliary } from "../utils";
import { createIntersection } from "../factory";

export const intersectionsMap = reactive(new Map<string, Point>());
export const intersectionsDep = reactive(new Map<Point, Set<Auxiliary>>());
export const intersections = computed(() => Array.from(intersectionsMap.values()));

export function setIntersections(line: Auxiliary) {
  for (let i = 0; i < auxiliaryLines.value.length; i++) {
    const auxiliary = auxiliaryLines.value[i];
    // if (isSameAuxiliary(line, auxiliary)) continue;

    try {
      const intersection = createIntersection(line, auxiliary);

      const key = `${intersection.x},${intersection.y}`;

      if (!intersectionsMap.has(key)) {
        intersectionsMap.set(key, intersection);

        // 记录交点的辅助线
        const dep =
          intersectionsDep.get(intersection) || new Set<StraightLine>();
        dep.add(line);
        dep.add(auxiliary);
        intersectionsDep.set(intersection, dep);
      }
    } catch (error) {
      // console.warn('交点不存在');
    }
  }
}