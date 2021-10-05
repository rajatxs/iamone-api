import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppModel, timestampType } from '@classes/AppModel'
import { UserAccessTokenPayload, UserAuthToken, RegisteredAuthTokenResponse } from './auth.interface'

@Injectable()
export class AuthService extends AppModel {
   public constructor(private readonly jwtService: JwtService) {
      super('userAuthTokens', { timestamps: timestampType.CREATED_AT })
   }

   /** Register new auth token for user */
   public async registerNewUserAuthToken(payload: UserAccessTokenPayload, username?: string): Promise<RegisteredAuthTokenResponse> {
      const accessToken = await this.jwtService.signAsync(payload, { subject: username })
      let refreshToken = ''

      return { accessToken, refreshToken }
   }

   public verifyAccessToken(token: string) {
      return this.jwtService.verify(token)
   }
}
