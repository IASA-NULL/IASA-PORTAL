import commonApi from "./commonApi";

export interface MusicRequest {
    request: {
        type: string,
        uid: number
    }
}

export interface MusicResponseOne {
    name: string,
    singer: string,
    thumbnail: string,
    yt: string,
}

export interface MusicResponse extends commonApi {
    data: {
        today: MusicResponseOne[],
        tomorrow: MusicResponseOne[]
    }
}
