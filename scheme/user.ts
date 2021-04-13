import { Permission } from './api/auth'

export type UID = number
export type SID = number

export enum Gender {
    male,
    female,
}

export interface User {
    permission: Permission
    uid: UID
    sid: SID
    gender: Gender
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
    lastPWChange?: number
}

export interface UserInfo {
    name: string
    uid: UID
    type: Permission
}
