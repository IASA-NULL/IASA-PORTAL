export default function createURL(root: string, ...props: any[]) {
    return `//${root ? root + '.' : ''}iasa.kr/${props.join('/')}`
}
