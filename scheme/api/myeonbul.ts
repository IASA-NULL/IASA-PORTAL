import {teacher} from "../teacher/teacher";
import commonApi from "./commonApi";

export enum MyeonbulRequestListType {
    listByUser,
    listByDate
}

export interface MyeonbulRequestList {
    type: MyeonbulRequestListType
}

export type MyeonbulRequest = MyeonbulRequestList

export interface MyeonbulResponseOne {
    timeRange: {
        begin: number,
        end: number,
        nickname?: string
    }
    place: string,
    teacher: teacher,
    approved: boolean
}

export interface MyeonbulResponse extends commonApi {
    data: MyeonbulResponseOne[]
}
