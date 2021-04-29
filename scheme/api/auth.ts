import { UID } from '../user'
import { sudoTime } from '../../backend/util/tokenTime'
import { getServerToken } from '../../backend/util/serverState'

export enum Permission {
    none = 1,
    student,
    teacher,
    admin,
    api,
}

export interface token {
    id: string
    uid: UID
    code: number
    name: string
    expire: number
    permission: Permission
    sid: string
    tokenId: string
    sudo?: boolean
    expired?: boolean
}

export interface SudoToken {
    expire: number
    sid: string
    tokenId: string
}

export interface signupToken {
    type: Permission
    uid: UID
    id: string
    password: string
    email: string
    name: string
    expire: number
    avatar: string
}

export interface changePasswordToken {
    id: string
    expire: number
}
