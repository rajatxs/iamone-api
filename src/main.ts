import { NestFactory } from '@nestjs/core'
import { VersioningType } from '@nestjs/common'
import { AppModule } from './app.module'
import { AppMiddleware } from './app.middleware'
import { cyanBright } from 'chalk'
import { format } from 'util'
import { hostname } from 'os'
import { CorsConfig } from '@config/cors'
import env from './@utils/env'
import * as db from './@utils/db'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = env.port || 3000
  
  app.enableCors(<any>CorsConfig)
  app.use(AppMiddleware)
  app.enableVersioning({ 
    type: VersioningType.HEADER, 
    header: 'X-Api-Version' 
  })

  await app.listen(port)

  if (env.nodeEnv !== 'production') {
    const msg = format('\nServer is running at %s\n', cyanBright(`http://${hostname()}:${port}`))
    process.stdout.write(msg)
  }
}

db
  .connect()
  .finally(bootstrap)
