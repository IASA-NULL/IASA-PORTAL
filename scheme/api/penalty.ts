import commonApi from './commonApi'
import {UserInfo} from "../user"

export interface PenaltyRequest {
    token: string
    request: {
        type: string
        uid: number
    }
}

export interface PenaltyResponseOne {
    score: number
    teacher: UserInfo
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