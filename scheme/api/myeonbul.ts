import commonApi from './commonApi'
import { UserInfo } from '../user'

export enum MyeonbulRequestListType {
    listByUser,
    listByDate,
}

export interface MyeonbulRequestList {
    type: MyeonbulRequestListType
}

export type MyeonbulRequest = MyeonbulRequestList

export enum MyeonbulResponseType {
    ACCEPT,
    DENY,
    UNDEFINED,
}

export interface MyeonbulResponse {
    type: MyeonbulResponseType
}

export interface MyeonbulQueryOne {
    timeRange: {
        begin: number
        end: number
        nickname?: string
    }
    place: string
    reason: string
    teacher: UserInfo
    target: UserInfo
    sid: number
    tid: number
}

export interface MyeonbulDB extends MyeonbulQueryOne {
    mid: string
    approved: MyeonbulResponseType
    date: string
}

export interface MyeonbulQuery extends commonApi {
    data: MyeonbulQueryOne[]
}
