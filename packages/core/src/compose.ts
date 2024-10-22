import { Props, Request } from './types'

type AttributesOnly<T> = {
  [P in keyof T as P extends 'prototype' ? never : P]: T[P]
}

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
// F = Function
//
// RA = Root Args
// ROP = Root Output Props
// RR = Root Results
// H1IP = Hook 1 Input Props
// ER = Endpoint Result
// H3R = Hook 3 Result
// H3RF = Hook 3 Return Function

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  ER,
  EF extends (props: ROP) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> & { _props: ROP }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<H1R>,
  H1R,
  ER,
  EF extends (props: MergeProps<[ROP, H1OP]>) => any
>(
  r: (func: (props: ROP) => Promise<any>) => RRF,
  h1: (func: (props: H1OP) => Promise<any>) => H1RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> & { _props: MergeProps<[ROP, H1OP]> }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  ER,
  EF extends (props: MergeProps<[ROP, H1OP, H2OP]>) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> & { _props: MergeProps<[ROP, H1OP, H2OP]> }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  ER,
  EF extends (props: MergeProps<[ROP, H1OP, H2OP, H3OP]>) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> & { _props: MergeProps<[ROP, H1OP, H2OP, H3OP]> }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  ER,
  EF extends (props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP]>) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> & { _props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP]> }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  ER,
  EF extends (props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP]>) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> & {
    _props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP]>
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  ER,
  EF extends (
    props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP]>
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> & {
    _props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP]>
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  H7IP extends Props,
  H7OP extends Props,
  H7RF extends (props: H6IP extends H7IP ? H7IP : never) => Promise<any>,
  ER,
  EF extends (
    props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP]>
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  h7: (func: (props: H7OP) => any) => H7RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> &
  AttributesOnly<H7RF> & {
    _props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP]>
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  H7IP extends Props,
  H7OP extends Props,
  H7RF extends (props: H6IP extends H7IP ? H7IP : never) => Promise<any>,
  H8IP extends Props,
  H8OP extends Props,
  H8RF extends (props: H7IP extends H8IP ? H8IP : never) => Promise<any>,
  ER,
  EF extends (
    props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP]>
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  h7: (func: (props: H7OP) => any) => H7RF,
  h8: (func: (props: H8OP) => any) => H8RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> &
  AttributesOnly<H7RF> &
  AttributesOnly<H8RF> & {
    _props: MergeProps<[ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP]>
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  H7IP extends Props,
  H7OP extends Props,
  H7RF extends (props: H6IP extends H7IP ? H7IP : never) => Promise<any>,
  H8IP extends Props,
  H8OP extends Props,
  H8RF extends (props: H7IP extends H8IP ? H8IP : never) => Promise<any>,
  H9IP extends Props,
  H9OP extends Props,
  H9RF extends (props: H8IP extends H9IP ? H9IP : never) => Promise<any>,
  ER,
  EF extends (
    props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP]
    >
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  h7: (func: (props: H7OP) => any) => H7RF,
  h8: (func: (props: H8OP) => any) => H8RF,
  h9: (func: (props: H9OP) => any) => H9RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> &
  AttributesOnly<H7RF> &
  AttributesOnly<H8RF> &
  AttributesOnly<H9RF> & {
    _props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP]
    >
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  H7IP extends Props,
  H7OP extends Props,
  H7RF extends (props: H6IP extends H7IP ? H7IP : never) => Promise<any>,
  H8IP extends Props,
  H8OP extends Props,
  H8RF extends (props: H7IP extends H8IP ? H8IP : never) => Promise<any>,
  H9IP extends Props,
  H9OP extends Props,
  H9RF extends (props: H8IP extends H9IP ? H9IP : never) => Promise<any>,
  H10IP extends Props,
  H10OP extends Props,
  H10RF extends (props: H9IP extends H10IP ? H10IP : never) => Promise<any>,
  ER,
  EF extends (
    props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP, H10OP]
    >
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  h7: (func: (props: H7OP) => any) => H7RF,
  h8: (func: (props: H8OP) => any) => H8RF,
  h9: (func: (props: H9OP) => any) => H9RF,
  h10: (func: (props: H10OP) => any) => H10RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> &
  AttributesOnly<H7RF> &
  AttributesOnly<H8RF> &
  AttributesOnly<H9RF> &
  AttributesOnly<H10RF> & {
    _props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP, H10OP]
    >
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  H7IP extends Props,
  H7OP extends Props,
  H7RF extends (props: H6IP extends H7IP ? H7IP : never) => Promise<any>,
  H8IP extends Props,
  H8OP extends Props,
  H8RF extends (props: H7IP extends H8IP ? H8IP : never) => Promise<any>,
  H9IP extends Props,
  H9OP extends Props,
  H9RF extends (props: H8IP extends H9IP ? H9IP : never) => Promise<any>,
  H10IP extends Props,
  H10OP extends Props,
  H10RF extends (props: H9IP extends H10IP ? H10IP : never) => Promise<any>,
  H11IP extends Props,
  H11OP extends Props,
  H11RF extends (props: H10IP extends H11IP ? H11IP : never) => Promise<any>,
  ER,
  EF extends (
    props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP, H10OP, H11OP]
    >
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  h7: (func: (props: H7OP) => any) => H7RF,
  h8: (func: (props: H8OP) => any) => H8RF,
  h9: (func: (props: H9OP) => any) => H9RF,
  h10: (func: (props: H10OP) => any) => H10RF,
  h11: (func: (props: H11OP) => any) => H11RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> &
  AttributesOnly<H7RF> &
  AttributesOnly<H8RF> &
  AttributesOnly<H9RF> &
  AttributesOnly<H10RF> &
  AttributesOnly<H11RF> & {
    _props: MergeProps<
      [ROP, H1OP, H2OP, H3OP, H4OP, H5OP, H6OP, H7OP, H8OP, H9OP, H10OP, H11OP]
    >
  }

export function compose<
  RA extends Array<any>,
  ROP extends Props,
  RRF extends { (...args: RA): Promise<any> },
  H1IP extends Props,
  H1OP extends Props,
  H1RF extends (props: ROP extends H1IP ? H1IP : never) => Promise<any>,
  H2IP extends Props,
  H2OP extends Props,
  H2RF extends (props: H1IP extends H2IP ? H2IP : never) => Promise<any>,
  H3IP extends Props,
  H3OP extends Props,
  H3RF extends (props: H2IP extends H3IP ? H3IP : never) => Promise<any>,
  H4IP extends Props,
  H4OP extends Props,
  H4RF extends (props: H3IP extends H4IP ? H4IP : never) => Promise<any>,
  H5IP extends Props,
  H5OP extends Props,
  H5RF extends (props: H4IP extends H5IP ? H5IP : never) => Promise<any>,
  H6IP extends Props,
  H6OP extends Props,
  H6RF extends (props: H5IP extends H6IP ? H6IP : never) => Promise<any>,
  H7IP extends Props,
  H7OP extends Props,
  H7RF extends (props: H6IP extends H7IP ? H7IP : never) => Promise<any>,
  H8IP extends Props,
  H8OP extends Props,
  H8RF extends (props: H7IP extends H8IP ? H8IP : never) => Promise<any>,
  H9IP extends Props,
  H9OP extends Props,
  H9RF extends (props: H8IP extends H9IP ? H9IP : never) => Promise<any>,
  H10IP extends Props,
  H10OP extends Props,
  H10RF extends (props: H9IP extends H10IP ? H10IP : never) => Promise<any>,
  H11IP extends Props,
  H11OP extends Props,
  H11RF extends (props: H10IP extends H11IP ? H11IP : never) => Promise<any>,
  H12IP extends Props,
  H12OP extends Props,
  H12RF extends (props: H11IP extends H12IP ? H12IP : never) => Promise<any>,
  ER,
  EF extends (
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
  ) => any
>(
  r: (func: (props: ROP) => any) => RRF,
  h1: (func: (props: H1OP) => any) => H1RF,
  h2: (func: (props: H2OP) => any) => H2RF,
  h3: (func: (props: H3OP) => any) => H3RF,
  h4: (func: (props: H4OP) => any) => H4RF,
  h5: (func: (props: H5OP) => any) => H5RF,
  h6: (func: (props: H6OP) => any) => H6RF,
  h7: (func: (props: H7OP) => any) => H7RF,
  h8: (func: (props: H8OP) => any) => H8RF,
  h9: (func: (props: H9OP) => any) => H9RF,
  h10: (func: (props: H10OP) => any) => H10RF,
  h11: (func: (props: H11OP) => any) => H11RF,
  h12: (func: (props: H12OP) => any) => H12RF,
  e: EF
): RRF & { endpoint: EF } & AttributesOnly<EF> &
  AttributesOnly<H1RF> &
  AttributesOnly<H2RF> &
  AttributesOnly<H3RF> &
  AttributesOnly<H4RF> &
  AttributesOnly<H5RF> &
  AttributesOnly<H6RF> &
  AttributesOnly<H7RF> &
  AttributesOnly<H8RF> &
  AttributesOnly<H9RF> &
  AttributesOnly<H10RF> &
  AttributesOnly<H11RF> &
  AttributesOnly<H12RF> & {
    _props: MergeProps<
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
  }

export function compose(...funcs: Function[]): Function {
  const result: any = funcs.reverse().reduce((acc, fn) => {
    const next = fn(acc)
    Object.keys(acc).forEach(key => {
      next[key] = (acc as any)[key]
    })
    return next
  })
  result.endpoint = funcs[0]
  return result
}
