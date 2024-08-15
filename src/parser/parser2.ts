import * as Babel from '@babel/standalone'
import type Babel_Types from '@babel/types'
import CAD from './CAD.ts'

type Types = typeof Babel_Types
type PluginArg = { types: Types }
type Plugin = (obj: PluginArg) => any

// console.log(Babel);

const plugin: Plugin = function ({ types }) {
  // console.log(arguments);
  const { conditionalExpression, binaryExpression } = types
  const { assignmentExpression } = types
  function transformSTEP(variable: any, args: any[]) {
    if (args.length === 1) {
      return args[0];
    } else {
      const [value, condition] = args;
      const node = conditionalExpression(
        binaryExpression('<', variable, condition),
        value,
        transformSTEP(variable, args.slice(2))
      )
      return node;
    }
  }
  
  function transformSTEPUP(variable: any, args: any[]) {
    if (args.length === 1) {
      return args[0];
    } else {
      const [value, condition] = args;
      const node = conditionalExpression(
        binaryExpression('<=', variable, condition),
        value,
        transformSTEP(variable, args.slice(2))
      )
      return node;
    }
  }

  function transformCase(args: any[]) {
    if(args.length === 1){
      return args[0];
    } else {
      const [value, condition] = args;
      const node = conditionalExpression(
        condition,
        value,
        transformCase(args.slice(2))
      )
      return node;
    }
  }
  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        const funcName = node.callee.name;
  
        if (funcName === 'STEP') {
          const [variable, ...args] = node.arguments
          let newNode = transformSTEP(variable, args)
          path.replaceWith(newNode)
        }else if(funcName === 'STEPUP'){
          const [variable, ...args] = node.arguments
          let newNode = transformSTEPUP(variable, args)
          path.replaceWith(newNode)
        }else if(funcName === 'CASE'){
          let newNode = transformCase(node.arguments)
          path.replaceWith(newNode)
        }
      },
      AssignmentExpression(path) {
        const { left, right, operator } = path.node;
        if (operator === '=') {
          const newNode = binaryExpression('===', left, right)
          path.replaceWith(newNode)
        }
      }
    }
  }
}


// let code1 = 'MINMAX(300,20,6000)';
// let code2 = 'L-D';
// let code3 = 'ROUNDDOWN(2*CCAL/3,0.5)';
// let code4 = 'W-STEP(CCAL,0.5,0.6,1,4.2,2,8.5,3)'
// let code5 = 'MINMAX(MIN(STEP(L+L+W+W1,13,250,16,500,19,600,25,700,35,800,45),STEPUP(CCAL,20,0.8,25,1,30,1.5,35,3,40,5,45)),5,W1-1)';
// let code6 = 'CASE(MINMAX(0.5,0,1),CCAL<=0.5,MINMAX(IIL,IIL,CCAL))';
// let code7 = 'MINMAX(0.5,0.2,CASE(CASE(CASE(3,(W>30 AND W<=80),0.5,(W>8 AND W<=30),4),D>=W/3,3),(L>160 AND L<=210),CASE(CASE(0.5,(W>8 AND W<=30),3),D>=W/3,2),(L>60 AND L<=160),CASE(1.5,(L/W<=2.5 AND D>=W/3),1),(L>30 AND L<=60),0.5,L<=30,CASE(5,L/W<=2.5,CASE(3,(W>30 AND W<=80),0.5,(W>8 AND W<=30),4))))'
// let code8 = 'CASE(0,AX=0,AX+2)'
// const source = [code1, code2, code3, code4, code5, code6];
// const start = +Date.now();
// console.log(source.map(_ => parse(_).code));
// const end = +Date.now();
// console.log(end,  start);
// console.log(parse(code8).code);

export function parse(sourceCode: string) {
  sourceCode = sourceCode.replace(/\bAND\b/g, '&&').replace(/\bOR\b/g, '||');
  return Babel.transform(sourceCode, {
      plugins: [plugin], //使用插件
  });
}

export function parseToFunc(sourceCode: string) {
  const code = parse(sourceCode).code;
  return function (params: any): number {
    Object.setPrototypeOf(CAD, params);
    return new Function(`with(this) { return ${code} }`).call(CAD); 
  };
}

