import {v4 as uuid} from 'uuid'

let serverState = {} as any

export function getServerState(key: string) {
    return serverState[key]
}

export function setServerState(key: string, value: any) {
    serverState[key] = value
}

export function getServerToken() {
    if (!serverState) setServerState('sid', uuid())
    return getServerState('sid')
}
