import {teacher} from "../teacher/teacher";
import commonApi from "./commonApi";

export interface MyeonbulRequest {
    request: {
        type: string,
        uid: number
    }
}

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
