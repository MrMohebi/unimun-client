type ICal = (differenceSeconds: number) => string

interface IComparisons {
    graterThan: number,
    lessThan: number,
    action: ICal
}


export function passedTime(timestamp: number, faNum: boolean = false): string | undefined {
    const currentStamp = Math.floor(Date.now() / 1000)
    const passedSeconds = currentStamp - timestamp
    console.log(passedSeconds);
    const comparisons: IComparisons[] = [
        {graterThan: 0, lessThan: 5, action: calNow},
        {graterThan: 0, lessThan: 60, action: calRecently},
        {graterThan: 0, lessThan: 3600, action: calMinute},
        {graterThan: 0, lessThan: 86400, action: calHours},
        {graterThan: 0, lessThan: 604800, action: calDays},
        {graterThan: 0, lessThan: 2419200, action: calWeeks},
        {graterThan: 0, lessThan: 29030400, action: calMonths},
        {graterThan: 0, lessThan: 999999999999, action: calYears},
    ]

    for (let i = 0; i < comparisons.length; i++) {
        if (passedSeconds > comparisons[i].graterThan && passedSeconds <= comparisons[i].lessThan) {
            if (faNum) {
                return numberToString(comparisons[i].action(passedSeconds))
            } else {
                return comparisons[i].action(passedSeconds);
            }
        }
    }

}


const calNow: ICal = (differenceSeconds) => {
    return "هم اکنون"
}

const calRecently: ICal = (differenceSeconds) => {
    return "چند لحظه پیش"
}

const calMinute: ICal = (differenceSeconds) => {
    return Math.floor(differenceSeconds / 60).toString() + " دقیقه پیش "
}

const calHours: ICal = (differenceSeconds) => {
    return Math.floor(differenceSeconds / 60 / 60).toString() + " ساعت پیش "
}

const calDays: ICal = (differenceSeconds) => {
    const passedDays = Math.floor(differenceSeconds / 24 / 60 / 60)
    if (passedDays == 1) return "دیروز"
    return passedDays.toString() + " روز پیش "
}

const calWeeks: ICal = (differenceSeconds) => {
    return Math.floor(differenceSeconds / 7 / 24 / 60 / 60).toString() + " هفته پیش "
}

const calMonths: ICal = (differenceSeconds) => {
    return Math.floor(differenceSeconds / 4 / 7 / 24 / 60 / 60).toString() + " ماه پیش "
}


const calYears: ICal = (differenceSeconds) => {
    return Math.floor(differenceSeconds / 12 / 4 / 7 / 24 / 60 / 60).toString() + " سال پیش "
}


const numberToString = (str: string): string => {
    let firstNum = (str.match(/\d+/) ?? [undefined])[0]

    // couldn't find number

    if (isNaN((+firstNum))) return str;

    const num = parseInt(firstNum)

    const stringNum = (num) => {
        switch (num) {
            case 0:
                return "صفر";
            case 1:
                return "یک";
            case 2:
                return "دو";
            case 3:
                return "سه";
            case 4:
                return "چهار";
            case 5:
                return "پنج";
            case 6:
                return "شش";
            case 7:
                return "هفت";
            case 8:
                return "هشت";
            case 9:
                return "نه";
            case 10:
                return "ده";
            case 11:
                return "یازده";
            case 12:
                return "دوازده";
            case 13:
                return "سیزده";
            case 14:
                return "چهارده";
            case 15:
                return "پانزده";
            case 16:
                return "شانزده";
            case 17:
                return "هفده";
            case 18:
                return "هجده";
            case 19:
                return "نانزده";
            case 20:
                return "بیست";
            case 30:
                return "سی";
            case 40:
                return "چهل";
            case 50:
                return "پنجاه";
            case 60:
                return "شصت";
            case 70:
                return "هفتاد";
            case 80:
                return "هشتاد";
            case 90:
                return "نود";
        }
    }


    if (num < 20) {
        return str.replace(num.toString(), stringNum(num))
    }

    if (num < 100) {
        const unity = parseInt(num.toString()[1]);
        const decimal = parseInt(num.toString()[0]) * 10;
        return str.replace(num.toString(), stringNum(decimal) + " و " + stringNum(unity))
    }
}