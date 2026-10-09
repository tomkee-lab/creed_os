declare module 'd3-scale' {
  export function scaleLinear<Output = number, Range = number>(): any;
  export function scalePoint<Domain = any>(): any;
  export function scaleOrdinal<Domain = any, Range = any>(): any;
  export function scaleBand<Domain = any>(): any;
  export function scaleTime<Output = number, Range = number>(): any;
  export function scaleLog<Output = number, Range = number>(): any;
  export function scalePow<Output = number, Range = number>(): any;
  export function scaleSqrt<Output = number, Range = number>(): any;
}
