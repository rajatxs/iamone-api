import { Injectable } from '@nestjs/common'
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt'
import env from '@utils/env'

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
   public createJwtOptions(): JwtModuleOptions {
      const { jwtPrivateKey: privateKey } = env

      return { privateKey }
   }
}
