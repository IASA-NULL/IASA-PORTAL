import fs from "fs"

let secret: string

export default function getSecret() {
    if (secret) return secret
    secret = fs.readFileSync('secret').toString()
    return secret
}
