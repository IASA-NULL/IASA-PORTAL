import { Permission } from './api/auth'

export type UID = number

export interface User {
    permission: Permission
    uid: UID
    id: string
    pwHash: string
    email: string
    name: string
    penalty?: number
    avatar?: string
    mail?: string[]
    unreadNotifications: number
    group: string[]
    createTime: number
}

export interface UserInfo {
    name: string
    uid: UID
    type: Permission
}
