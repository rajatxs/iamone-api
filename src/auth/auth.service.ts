import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserAccessTokenPayload, RegisteredAuthTokenResponse } from './auth.interface'

@Injectable()
export class AuthService {
   public constructor(private readonly jwtService: JwtService) { }

   /** Register new auth token for user */
   public async generateUserAuthToken(payload: UserAccessTokenPayload, subject: string): Promise<RegisteredAuthTokenResponse> {
      let accessToken: string, refreshToken = ''

      payload.admin = false
      accessToken = await this.jwtService.signAsync(payload, {
         subject, expiresIn: '2d'
      })

      return { accessToken, refreshToken }
   }

   /** Verify user auth token */
   public verifyUserAuthToken(token: string): Promise<UserAccessTokenPayload> {
      return this.jwtService.verifyAsync(token)
   }
}
