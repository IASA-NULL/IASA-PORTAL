export interface TimeRange {
    begin: number
    end: number
    nickname?: string
}

export function timeRange(
    begin: number,
    end: number,
    nickname?: string
): TimeRange {
    return {
        begin: begin,
        end: end,
        nickname: nickname,
    }
}

export function getToday(hour: number, minute: number, second = 0) {
    const today = new Date()
    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hour,
        minute,
        second
    ).getTime()
}

export function formatTime(hour: number, minute: number, second?: number) {
    if (second !== undefined) {
        return `${('00' + hour).substr(-2)}:${('00' + minute).substr(-2)}:${(
            '00' + second
        ).substr(-2)}`
    } else {
        return `${('00' + hour).substr(-2)}:${('00' + minute).substr(-2)}`
    }
}
