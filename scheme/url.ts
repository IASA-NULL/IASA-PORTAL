declare const DEV_MODE: boolean

export default function createURL(root: string, ...props: any[]) {
    return DEV_MODE
        ? `/${root ? root + '/' : ''}${props.join('/')}`
        : `//${root ? root + '.' : ''}iasa.kr/${props.join('/')}`
}
