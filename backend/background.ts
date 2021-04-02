import mailParse from './mailParse'

declare const DEV_MODE: boolean

export default function backgroundWork() {
    if (!DEV_MODE) setInterval(mailParse, 5000)
}
