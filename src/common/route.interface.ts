import { Request, Response, NextFunction, Router } from 'express'

export interface IControllerRoute {
  path: string
  func: (req: Request, res: Response, next: NextFunction) => void
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>
}

export type ExpressReturnType = Response<any, Record<string, any>>
