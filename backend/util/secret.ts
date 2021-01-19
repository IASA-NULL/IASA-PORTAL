import fs from 'fs'
import getPath from './getPath'

let secret = Object()

export default function getSecret(type: string) {
    if (secret[type]) return secret[type]
    secret[type] = fs.readFileSync(getPath('secret', type)).toString().trim()
    return secret[type]
}

export const saltRount = 10
