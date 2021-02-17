import {teacher} from '../teacher/teacher'
import commonApi from './commonApi'
import exp from "constants";

export interface PenaltyRequest {
    token: string
    request: {
        type: string
        uid: number
    }
}

export interface PenaltyResponseOne {
    score: number
    teacher: teacher
    info: string
    time: number
}

export interface Penalty {
    score: number
    history: PenaltyResponseOne[]
}

export interface PenaltyResponse extends commonApi {
    data: Penalty
}