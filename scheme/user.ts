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

export interface Club {
    permission: string
    uid: string
    name: string
    poster?: any
    logo?: string
    subject?: string
    introduce?: string
    interview?: string
    interviewTime?: string
    coverLetter?: string
    maxStudent?: string
    url?: string
    backgroundColor1?: string
    backgroundColor2?: string
    backgroundColor3?: string
}

export interface Person {
    number: string
    name: string
    first1: string
    first2: string
    second1: string
    second2: string
    firstClub: string
    secondClub: string
}
