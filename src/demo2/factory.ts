import { boxAttributes } from "../params";
import { parseToFunc } from "../parser/parser2";
import { caculateIntersection } from "./utils";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a horizontal auxiliary line based on the given Formula.
 *
 * @param {Formula} C - 与y轴交点的x坐标的公式.
 * @return {Auxiliary} - 返回新的水平辅助线.
 */
export function createHorizontalAuxiliary(formula: Formula): Auxiliary {
  const C = parseToFunc(formula)(boxAttributes.value);

  return {
    A: 0,
    B: 1,
    C: -C,
    serialize,
  };

  function serialize() {
    return `drawAuxiliary(createHorizontalAuxiliary(\'${formula}\'))`;
  }
}

/**
 * Creates a vertical auxiliary line based on the given Formula.
 *
 * @param {Formula} C - 与x轴交点的y坐标的公式.
 * @return {Auxiliary} - 返回新的垂直辅助线.
 */
export function createVerticalAuxiliary(formula: Formula) {
  const C = parseToFunc(formula)(boxAttributes.value);

  return {
    A: 1,
    B: 0,
    C: -C,
    serialize,
  };

  function serialize() {
    return `drawAuxiliary(createVerticalAuxiliary(\'${formula}\'))`;
  }
}

export function createIntersection(line1: Auxiliary, line2: Auxiliary): Point {
  const { x, y } = caculateIntersection(line1, line2);
  return {
    x,
    y,
    serialize,
  };

  function serialize() {
    return `createIntersection(${line1.serialize()}, ${line2.serialize()})`;
  }
}

export function createAuxiliaryWithPoints(pre: Point, next: Point): Auxiliary {
  const A = next.y - pre.y;
  const B = pre.x - next.x;
  const C = next.x * pre.y - pre.x * next.y;
  return {
    A,
    B,
    C,
    serialize,
  };

  function serialize() {
    return `drawAuxiliary(createAuxiliaryWithPoints(${pre.serialize()}, ${next.serialize()}))`;
  }
}

export function createAuxiliaryWithAngle(
  point: Point,
  angle: number
): Auxiliary {
  const degree = (angle / 180) * Math.PI;
  const { x, y } = point;
  const A = Math.sin(degree);
  const B = -Math.cos(degree);
  const C = Math.cos(degree) * y - Math.sin(degree) * x;
  return {
    A,
    B,
    C,
    serialize,
  };

  function serialize() {
    return `drawAuxiliary(createAuxiliaryWithAngle(${point.serialize()}, ${angle}))`;
  }
}

export default {
  createHorizontalAuxiliary,
  createVerticalAuxiliary,
  createIntersection,
  createAuxiliaryWithPoints,
  createAuxiliaryWithAngle,
  getFaceData(...args: any) {
    return args;
  },
};

const hashStore = {};
function useRetrieveStore(serializeFn: () => string, option: any) {
  let count = 0;

  return {
    increase,
    serialize,
  };
  function increase() {
    count++;
  }
  function serialize() {
    let serializeStr = serializeFn();
    if (count > 1) {
      let id = uuidv4();

      hashStore[id] = serializeStr;
      serializeStr = `retrieve(\'${id}\')`;
    }
    return serializeStr;
  }
}
