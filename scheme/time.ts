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

export function getToday(hour: number, minute: number, second?: number) {
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
