import type { Request, Response } from 'express'

export type ArgMapper = (req: Request, res: Response) => Promise<any[]>
export type ResMapper <T> = (req: Request, res: Response, result: T) => void

export type LocalFrameworkMapper <T = any> = {
  toArgs: ArgMapper
  toRes: ResMapper<T>
}