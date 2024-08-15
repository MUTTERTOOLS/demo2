export default class CAD {
  static CASE(...args) {
    if (args.length % 2 !== 1) {
      throw new Error('args length is illegal.');
    }
    const count = Math.floor(args.length / 2);
    for (let i = 0; i < count; i++) {
      if (args[i * 2 + 1]) {
        return args[i * 2];
      }
    }
    return args[args.length - 1];
  }

  static ROUNDDOWN(value, delta) {
    const scale = 1000;
    value *= scale;
    delta *= scale;
    if (value % delta === 0) {
      return value / scale;
    } else {
      return (Math.floor(value / delta) * delta) / scale;
    }
  }

  static ROUNDUP(value, delta) {
    const scale = 1000;
    value *= scale;
    delta *= scale;
    if (value % delta === 0) {
      return value / scale;
    } else {
      return (Math.ceil(value / delta) * delta) / scale;
    }
  }

  /**
   * 四舍五入
   * ROUND(3.5) = 4
   * ROUND(3.88, 0.1) = 3.9
   * ROUND(3.47, 0.5) = 3.5
   * @param value
   * @param delta
   * @constructor
   */
  static ROUND(value, delta = 1) {
    const scale = 1000;
    value *= scale;
    delta *= scale;

    const remainder = value % delta; // 余数
    if (remainder === 0) {
      return value / scale;
    } else {
      const times = Math.floor(value / delta) + Number(remainder >= delta / 2);
      return (times * delta) / scale;
    }
  }

  static MIN(...params) {
    return Math.min(...params);
  }

  static MAX(...params) {
    return Math.max(...params);
  }

  static SQRT(param) {
    return Math.sqrt(param);
  }

  static ARCTAN(param) {
    return (Math.atan(param) * 180) / Math.PI;
  }

  static TAN(param) {
    return Math.tan((param / 180) * Math.PI);
  }

  static ARCSIN(param) {
    return (Math.asin(param) * 180) / Math.PI;
  }

  static SIN(param) {
    return Math.sin((param / 180) * Math.PI);
  }

  static ARCCOS(param) {
    return (Math.atan(param) * 180) / Math.PI;
  }

  static COS(param) {
    return Math.cos((param / 180) * Math.PI);
  }

  /**
   * 第一个参数是当前值，第二个是最小值，第三个是最大值，这个当前的值只能在min -> max 这个区间内
   * @param current
   * @param min
   * @param max
   * @constructor
   */
  static MINMAX(current, min, max) {
    if (max < min && max >= 0) {
      min = Math.min(min, max);
    }
    return Math.max(Math.min(current, max), min);
  }

  static STEP(detectVar: number, ...list: number[]): number {
    let index = 0;
    for (; index < list.length - 1; index += 2) {
      if (detectVar < list[index + 1]) {
        return list[index];
      }
    }
    return list[index];
  }

  static STEPUP(detectVar: number, ...list: number[]): number {
    let index = 0;
    for (; index < list.length - 1; index += 2) {
      if (detectVar <= list[index + 1]) {
        return list[index];
      }
    }
    return list[index];
  }
}