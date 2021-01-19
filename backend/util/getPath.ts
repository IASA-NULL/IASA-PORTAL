import path from 'path'

export default function getPath(...fileName: string[]) {
    return path.join(__dirname, '..', '..', '..', ...fileName)
}
