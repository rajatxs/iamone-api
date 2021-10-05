import { ObjectId } from 'mongodb'
import { JwtPayload } from 'jsonwebtoken'

export interface UserAccessTokenPayload extends JwtPayload {
   userId: string | ObjectId
}

export interface UserAuthToken extends ImmutableDoc {
   accessToken: string,
   refreshToken: string,
   userId: DocId,
   httpRequestId?: DocId
}

export type PartialUserAuthToken = Partial<UserAuthToken>

export type RegisteredAuthTokenResponse = Omit<UserAuthToken, 'userId' | 'httpRequestId'>
