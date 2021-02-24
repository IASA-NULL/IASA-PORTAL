export const MYEONBUL_CONFIRMED = '면불이 승인됐어요.'
export function MYEONBUL_REQUEST(name: string) {
    return `${name} 학생이 면불을 요청했어요.`
}

export function PENALTY_GOT(score: number) {
    return `${score > 0 ? '상점' : '벌점'} ${Math.abs(score)}점을 받았어요!`
}
