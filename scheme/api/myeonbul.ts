import commonApi from './commonApi'
import { UserInfo } from '../user'
import { getToday, timeRange, TimeRange } from '../time'

export type MID = string

export enum MyeonbulRequestListType {
    listByUser,
    listByDate,
}

export enum MyeonbulTimeType {
    WEEKDAY_1,
    WEEKDAY_2,
    WEEKDAY_ALL,
    WEEKEND_MORNING,
    WEEKEND_LUNCH,
    WEEKEND_DINNER_1,
    WEEKEND_DINNER_2,
    WEEKEND_DINNER_ALL,
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
    timeRange: TimeRange
    place: string
    reason: string
    teacher: UserInfo
    target: UserInfo
    sid: number
    tid: number
    response_nid?: string
}

export interface MyeonbulDB extends MyeonbulQueryOne {
    mid: MID
    approved: MyeonbulResponseType
    date: string
}

export interface MyeonbulQuery extends commonApi {
    data: MyeonbulQueryOne[]
}

export function getMyeonbulTime(type: MyeonbulTimeType) {
    if (
        type === MyeonbulTimeType.WEEKDAY_1 ||
        type === MyeonbulTimeType.WEEKEND_DINNER_1
    )
        return timeRange(getToday(19, 20), getToday(21, 0), '1차 면불')
    if (
        type === MyeonbulTimeType.WEEKDAY_2 ||
        type === MyeonbulTimeType.WEEKEND_DINNER_2
    )
        return timeRange(getToday(21, 30), getToday(23, 30), '2차 면불')
    if (
        type === MyeonbulTimeType.WEEKDAY_ALL ||
        type === MyeonbulTimeType.WEEKEND_DINNER_ALL
    )
        return timeRange(getToday(19, 20), getToday(23, 30), '1/2차 면불')
}
