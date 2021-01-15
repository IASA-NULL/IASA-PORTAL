import {v4 as uuid} from 'uuid'

let sid: string

export default function() {
    if (!sid) sid = uuid()
    return sid
}
