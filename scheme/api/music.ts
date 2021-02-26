import commonApi from './commonApi'
import { UID } from '../user'

export interface MusicRequest {
    request: {
        type: string
        uid: UID
    }
}

export interface MusicResponseOne {
    name: string
    singer: string
    thumbnail: string
    yt: string
}

export interface MusicResponse extends commonApi {
    data: {
        today: MusicResponseOne[]
        tomorrow: MusicResponseOne[]
    }
}
