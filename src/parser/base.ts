import CAD from './CAD.ts'
import parse from './parser2.ts'

let code2 = 'CCAL-IIL';

export default class Base extends CAD {
  public CCAL: number = 0.5
  public IIL: number = 0.2
  public parse = parse
  public NN = this.parse(code2)
}
window.Base = Base