export const MYEONBUL_CONFIRMED = '면불이 승인됐어요.'
export function MYEONBUL_REQUEST(name: string) {
    return `${name} 학생이 면불을 요청했어요.`
}
export function MYEONBUL_CREATED(name: string) {
    return `${name} 선생님이 면불을 생성했어요.`
}
export const MYEONBUL_RESPONSE_ALLOW = '면불이 승인됐어요!'
export const MYEONBUL_RESPONSE_DISALLOW = '면불이 반려됐어요!'

export function PENALTY_GOT(score: number) {
    return `${score > 0 ? '상점' : '벌점'} ${Math.abs(score)}점을 받았어요!`
}
