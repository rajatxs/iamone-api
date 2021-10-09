import { JwtPayload } from 'jsonwebtoken'

export interface UserAccessTokenPayload extends JwtPayload {
   id: string,
   admin?: boolean,
   name?: string,
   email?: string,
   email_verified?: boolean
}

export interface UserAuthToken extends ImmutableDoc {
   accessToken: string,
   refreshToken: string,
   userId: DocId,
   httpRequestId?: DocId
}

export type PartialUserAuthToken = Partial<UserAuthToken>

export type RegisteredAuthTokenResponse = Omit<UserAuthToken, 'userId' | 'httpRequestId'>
