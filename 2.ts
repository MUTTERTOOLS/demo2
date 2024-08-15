const code2 = "L - (L-W)/(W-L) * W";

import * as math from 'mathjs';

let res = math.simplify(code2)
console.log(res.toString());
