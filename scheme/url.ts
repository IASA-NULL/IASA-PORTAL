export default function createURL(root: string, ...props: any[]) {
    return `//iasa.kr/${root ? root + '/' : ''}${props.join('/')}`
    return `//${root ? root + '.' : ''}iasa.kr/${props.join('/')}`
}
