import { Permission } from './api/auth'
import { Penalty } from './api/penalty'

export type UID = number

export interface User {
    permission: Permission
    uid: UID
    id: string
    pwHash: string
    email: string
    name: string
    penalty?: Penalty
    avatar?: string
    mail?: string[]
    unreadNotifications: number
    group: string[]
}

export interface UserInfo {
    name: string
    uid: UID
    type: Permission
}
