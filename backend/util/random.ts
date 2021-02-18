export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomCode(size = 4) {
    return ('0'.repeat(size) + getRandomInt(1, 10 ** size - 1)).substr(-size)
}
