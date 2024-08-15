import * as math from "mathjs";

export function isVertical(line: Auxiliary) {
  return line.B === 0;
}

export function isHorizontal(line: Auxiliary) {
  return line.A === 0;
}

// 乘法代替除法
// 避免 1/3 === 1.1 / 3.3 返回 false 的情况
export function isSameAuxiliary(line1: Auxiliary, line2: Auxiliary) {
  if (isVertical(line1) && isVertical(line2)) {
    return Object.is(line1.A * line2.C, line1.C * line2.A);
  } else if (isHorizontal(line1) && isHorizontal(line2)) {
    return Object.is(line1.B * line2.C, line1.C * line2.B);
  } else {
    return (
      Object.is(line1.A * line2.B, line1.B * line2.A) &&
      Object.is(line1.A * line2.C, line1.C * line2.A)
    );
  }
}

// 计算交点，如果不存在，则会报错
export function caculateIntersection(line1: Auxiliary, line2: Auxiliary) {
  const { A: A1, B: B1, C: C1 } = line1;
  const { A: A2, B: B2, C: C2 } = line2;
  const coefficient = [
    [A1, B1],
    [A2, B2],
  ];
  const constant = [-C1, -C2];
  const [[x], [y]] = math.lusolve(coefficient, constant) as [
    [number],
    [number]
  ];
  return { x, y };
}
