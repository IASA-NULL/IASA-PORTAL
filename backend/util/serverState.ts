import { v4 as uuid } from 'uuid'
import fs from 'fs'

let serverState = {} as any

export function getServerState(key: string) {
    return serverState[key]
}

export function setServerState(key: string, value: any) {
    serverState[key] = value
}

export function getServerToken() {
    if (!getServerState('sid')) setServerState('sid', uuid())
    return getServerState('sid')
}

export function getServerFlag(key: string) {
    return fs.existsSync('C:\\Server\\state\\' + key)
}

export function setServerFlag(key: string) {
    fs.writeFileSync('C:\\Server\\state\\' + key, '1')
}
