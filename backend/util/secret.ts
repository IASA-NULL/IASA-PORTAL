import fs from "fs"
import path from "path";

let secret: string

export default function getSecret() {
    if (secret) return secret
    secret = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'secret')).toString()
    return secret
}
