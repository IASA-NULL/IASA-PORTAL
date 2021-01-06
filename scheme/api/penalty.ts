import {teacher} from "../teacher/teacher";
import commonApi from "./commonApi";

export interface PenaltyRequest {
    token: string
    request: {
        type: string,
        uid: number
    }
}

export interface PenaltyResponseOne {
    score: number,
    teacher: teacher,
    info: string,
    time: number
}

export interface PenaltyResponse extends commonApi {
    data: {
        score: number,
        history: PenaltyResponseOne[]
    }
}
