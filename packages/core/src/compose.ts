import { Props, Request } from './types'

type StripFunctionType<T> = {
  [P in keyof T as P extends 'prototype' ? never : P]: T[P];
};

type MergeProps<T extends Props[]> = Props<
  UnionToIntersection<T[number]['args']> extends infer A
    ? A extends {}
      ? A
      : {}
    : {},
  UnionToIntersection<T[number]['services']> extends infer B
    ? B extends {}
      ? B
      : {}
    : {},
  UnionToIntersection<T[number]['auth']> extends infer C
    ? C extends {}
      ? C
      : {}
    : {},
  UnionToIntersection<T[number]['request']> extends infer D
    ? D extends Request
      ? D
      : Request
    : Request,
  UnionToIntersection<T[number]['framework']> extends infer E
    ? E extends {}
      ? E
      : {}
    : {}
>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

//
// Generic Type Name Legend
//
// R = Root
// H = Hook
// E = Endpoint
//
// I = Input
// O = Output
//
// A = Arg
// P = Props
// R = Return
//
// RA = Root Args
// ROP = Root Output Props
// RR = Root Results
// H1IP = Hook 1 Input Props
// ER = Endpoint Result
// H3R = Hook 3 Result

export function compose<
  RA extends Array<any>, 
  ROP extends Props, 
  RR, 
  RRF extends (...args: RA) => Promise<RR>,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => RRF,
  e: (props: ROP) => Promise<ER>
): RRF

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  RRF extends (...args: RA) => Promise<RR>,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  ER
>(
  // TODO: Change Promise<any> to actual type. For some unknown 
  // reason setting it to the expected type Promise<H1R> causes 
  // the composision types to break. As it is now, the return 
  // types don't work but the composition types work
  r: (func: (props: ROP) => Promise<any>) => RRF,
  h1: (func: (props: H1OP) => Promise<ER>) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  e: (props: MergeProps<[ROP, H1OP]>) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  e: (props: MergeProps<[ROP, H1OP, H2OP]>) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  e: (props: MergeProps<[ROP, H1OP, H2OP, H3OP]>) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  e: (props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP]>) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  e: (props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP]>) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  e: (
    props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP]>
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  H7IP extends Props,
  H7OP extends Props,
  H7R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  h7: (
    func: (props: H7OP) => any
  ) => (props: H6OP extends H7IP ? H7IP : never) => Promise<H7R>,
  e: (
    props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP]>
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  H7IP extends Props,
  H7OP extends Props,
  H7R,
  H8IP extends Props,
  H8OP extends Props,
  H8R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  h7: (
    func: (props: H7OP) => any
  ) => (props: H6OP extends H7IP ? H7IP : never) => Promise<H7R>,
  h8: (
    func: (props: H8OP) => any
  ) => (props: H7OP extends H8IP ? H8IP : never) => Promise<H8R>,
  e: (
    props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP]>
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  H7IP extends Props,
  H7OP extends Props,
  H7R,
  H8IP extends Props,
  H8OP extends Props,
  H8R,
  H9IP extends Props,
  H9OP extends Props,
  H9R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  h7: (
    func: (props: H7OP) => any
  ) => (props: H6OP extends H7IP ? H7IP : never) => Promise<H7R>,
  h8: (
    func: (props: H8OP) => any
  ) => (props: H7OP extends H8IP ? H8IP : never) => Promise<H8R>,
  h9: (
    func: (props: H9OP) => any
  ) => (props: H8OP extends H9IP ? H9IP : never) => Promise<H9R>,
  e: (
    props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP]
    >
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  H7IP extends Props,
  H7OP extends Props,
  H7R,
  H8IP extends Props,
  H8OP extends Props,
  H8R,
  H9IP extends Props,
  H9OP extends Props,
  H9R,
  H10IP extends Props,
  H10OP extends Props,
  H10R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  h7: (
    func: (props: H7OP) => any
  ) => (props: H6OP extends H7IP ? H7IP : never) => Promise<H7R>,
  h8: (
    func: (props: H8OP) => any
  ) => (props: H7OP extends H8IP ? H8IP : never) => Promise<H8R>,
  h9: (
    func: (props: H9OP) => any
  ) => (props: H8OP extends H9IP ? H9IP : never) => Promise<H9R>,
  h10: (
    func: (props: H10OP) => any
  ) => (props: H9OP extends H10IP ? H10IP : never) => Promise<H10R>,
  e: (
    props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP, H10OP]
    >
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  H7IP extends Props,
  H7OP extends Props,
  H7R,
  H8IP extends Props,
  H8OP extends Props,
  H8R,
  H9IP extends Props,
  H9OP extends Props,
  H9R,
  H10IP extends Props,
  H10OP extends Props,
  H10R,
  H11IP extends Props,
  H11OP extends Props,
  H11R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  h7: (
    func: (props: H7OP) => any
  ) => (props: H6OP extends H7IP ? H7IP : never) => Promise<H7R>,
  h8: (
    func: (props: H8OP) => any
  ) => (props: H7OP extends H8IP ? H8IP : never) => Promise<H8R>,
  h9: (
    func: (props: H9OP) => any
  ) => (props: H8OP extends H9IP ? H9IP : never) => Promise<H9R>,
  h10: (
    func: (props: H10OP) => any
  ) => (props: H9OP extends H10IP ? H10IP : never) => Promise<H10R>,
  h11: (
    func: (props: H11OP) => any
  ) => (props: H10OP extends H11IP ? H11IP : never) => Promise<H11R>,
  e: (
    props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP, H10OP, H11OP]
    >
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RR,
  H1IP extends Props,
  H1OP extends Props,
  H1R,
  H2IP extends Props,
  H2OP extends Props,
  H2R,
  H3IP extends Props,
  H3OP extends Props,
  H3R,
  H4IP extends Props,
  H4OP extends Props,
  H4R,
  H5IP extends Props,
  H5OP extends Props,
  H5R,
  H6IP extends Props,
  H6OP extends Props,
  H6R,
  H7IP extends Props,
  H7OP extends Props,
  H7R,
  H8IP extends Props,
  H8OP extends Props,
  H8R,
  H9IP extends Props,
  H9OP extends Props,
  H9R,
  H10IP extends Props,
  H10OP extends Props,
  H10R,
  H11IP extends Props,
  H11OP extends Props,
  H11R,
  H12IP extends Props,
  H12OP extends Props,
  H12R,
  ER
>(
  r: (func: (props: ROP) => Promise<ER>) => (...args: RA) => Promise<RR>,
  h1: (
    func: (props: H1OP) => any
  ) => (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  h2: (
    func: (props: H2OP) => any
  ) => (props: H1OP extends H2IP ? H2IP : never) => Promise<H2R>,
  h3: (
    func: (props: H3OP) => any
  ) => (props: H2OP extends H3IP ? H3IP : never) => Promise<H3R>,
  h4: (
    func: (props: H4OP) => any
  ) => (props: H3OP extends H4IP ? H4IP : never) => Promise<H4R>,
  h5: (
    func: (props: H5OP) => any
  ) => (props: H4OP extends H5IP ? H5IP : never) => Promise<H5R>,
  h6: (
    func: (props: H6OP) => any
  ) => (props: H5OP extends H6IP ? H6IP : never) => Promise<H6R>,
  h7: (
    func: (props: H7OP) => any
  ) => (props: H6OP extends H7IP ? H7IP : never) => Promise<H7R>,
  h8: (
    func: (props: H8OP) => any
  ) => (props: H7OP extends H8IP ? H8IP : never) => Promise<H8R>,
  h9: (
    func: (props: H9OP) => any
  ) => (props: H8OP extends H9IP ? H9IP : never) => Promise<H9R>,
  h10: (
    func: (props: H10OP) => any
  ) => (props: H9OP extends H10IP ? H10IP : never) => Promise<H10R>,
  h11: (
    func: (props: H11OP) => any
  ) => (props: H10OP extends H11IP ? H11IP : never) => Promise<H11R>,
  h12: (
    func: (props: H12OP) => any
  ) => (props: H11OP extends H12IP ? H12IP : never) => Promise<H12R>,
  e: (
    props: MergeProps<
      [
        ROP,
        H1OP,
        H2OP,
        H3OP,
        H4OP,
        H5OP,
        H6OP,
        H7OP,
        H8OP,
        H9OP,
        H10OP,
        H11OP,
        H12OP
      ]
    >
  ) => Promise<ER>
): (...args: RA) => Promise<RR>

export function compose(...funcs: Function[]): Function {
  return funcs.reverse().reduce((acc, fn) => {
    const next = fn(acc)
    Object.keys(acc).forEach(key => {
      next[key] = (acc as any)[key]
    })
    return next
  })
}
