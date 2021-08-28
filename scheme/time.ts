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

export function formatTimeD(date: Date) {
    return formatTime(date.getHours(), date.getMinutes())
}

export function myeonbulTimtToString(timeRange: TimeRange) {
    let formattedDate: string,
        begin = new Date(timeRange.begin),
        end = new Date(timeRange.end)
    if (timeRange.nickname)
        formattedDate = `${end.getFullYear()}/${
            end.getMonth() + 1
        }/${end.getDate()} ${timeRange.nickname}`
    else if (begin.getDay() === end.getDay())
        formattedDate = `${end.getFullYear()}/${
            end.getMonth() + 1
        }/${end.getDate()} ${formatTimeD(begin)} - ${formatTimeD(end)}`
    else
        formattedDate = `${begin.getFullYear()}/${
            begin.getMonth() + 1
        }/${begin.getDate()} ${formatTimeD(begin)} - ${end.getFullYear()}/${
            end.getMonth() + 1
        }/${end.getDate()} ${formatTimeD(end)}`
    return formattedDate
}

export function dateToString(date: any) {
    let time = new Date(date)
    return `${time.getFullYear()}/${
        time.getMonth() + 1
    }/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
}
