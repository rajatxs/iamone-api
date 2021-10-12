import { Document } from 'mongodb'

export interface Admin extends Document, MutableDoc {
   fullname: string
   bio?: string
   email: string
   passwordHash: string
}

export type AdminCredentials = Pick<Admin, 'email' | 'password'>

export type PartialAdmin = Partial<Admin>
