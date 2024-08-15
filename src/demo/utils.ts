import StraightLine from "./StraightLine";

/**
 * Creates a horizontal auxiliary line based on the given formula.
 *
 * @param {Formula} C - 与y轴交点的x坐标的公式.
 * @return {StraightLine} - 返回新的水平辅助线.
 */
function createHorizontalAuxiliary(C: Formula) {
  return new StraightLine(1, 0, C, serialize);

  function serialize() {
    return `_line(1,0,\"${C}\")`;
  }
}

/**
 * Creates a vertical auxiliary line based on the given formula.
 *
 * @param {Formula} C - 与x轴交点的y坐标的公式.
 * @return {StraightLine} - 返回新的垂直辅助线.
 */
function createVerticalAuxiliary(C: Formula) {
  return new StraightLine(0, 1, C, serialize);

  function serialize() {
    return `_line(0,1,\"${C}\")`;
  }
}