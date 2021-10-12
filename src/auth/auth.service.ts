import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
   UserAuthTokenPayload,
   RegisteredAuthTokenResponse,
   AdminAuthTokenPayload
} from './auth.interface'

@Injectable()
export class AuthService {
   public constructor(private readonly jwtService: JwtService) { }

   /** Register new auth token for user */
   public async generateUserAuthToken(payload: UserAuthTokenPayload, subject: string): Promise<RegisteredAuthTokenResponse> {
      let accessToken: string, refreshToken = ''

      payload.admin = false
      accessToken = await this.jwtService.signAsync(payload, {
         subject,
         expiresIn: '2d',
      })

      return { accessToken, refreshToken }
   }

   /** Verify user auth token */
   public verifyUserAuthToken(token: string): Promise<UserAuthTokenPayload> {
      return this.jwtService.verifyAsync(token)
   }

   /** Generate auth token for Admin */
   public async generateAdminUserAuthToken(payload: AdminAuthTokenPayload, subject: string): Promise<RegisteredAuthTokenResponse> {
      let accessToken: string, refreshToken = ''

      payload.admin = true
      accessToken = await this.jwtService.signAsync(payload, {
         subject,
         expiresIn: '1d'
      })

      return { accessToken, refreshToken }
   }

   /** Verify admin auth token */
   public verifyAdminAuthToken(token: string): Promise<AdminAuthTokenPayload> {
      return this.jwtService.verifyAsync(token)
   }
}
