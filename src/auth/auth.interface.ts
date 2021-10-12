import { JwtPayload } from 'jsonwebtoken'

export interface AuthTokenPayload extends JwtPayload {
   id: string | DocId,
   admin?: boolean,
   name?: string,
   email?: string,
   email_verified?: boolean
}

export type UserAuthTokenPayload = AuthTokenPayload
export type AdminAuthTokenPayload = AuthTokenPayload

export interface UserAuthToken extends ImmutableDoc {
   accessToken: string,
   refreshToken: string,
   userId: DocId,
   httpRequestId?: DocId
}

export type PartialUserAuthToken = Partial<UserAuthToken>

export type RegisteredAuthTokenResponse = Omit<UserAuthToken, 'userId' | 'httpRequestId'>
