import { JwtPayload } from 'jsonwebtoken'

export interface AuthTokenPayload extends JwtPayload {
   id: string | DocId,
   admin?: boolean,
   name?: string,
   email?: string
}

export type AdminAuthTokenPayload = AuthTokenPayload
export interface UserAuthTokenPayload extends AuthTokenPayload {
   email_verified?: boolean
}

export interface RegisteredAuthTokenResponse {
   accessToken: string,
   refreshToken: string,
}
