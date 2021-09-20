import { Request, Response, NextFunction } from 'express'

export function AppMiddleware(req: Request, res: Response, next: NextFunction) {
  req.locals = {}
  req.locals.urlPath = req.path
  req.locals.requestId = null

  res.setHeader('Server', 'Developar')
  res.setHeader('Vary', 'Accept, Origin, Accept-Language')
  res.removeHeader('X-Powered-By')
  next()
}
