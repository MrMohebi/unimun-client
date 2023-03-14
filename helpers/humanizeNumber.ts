export function humanizeNumber(num: number): string {
    if (!num)
        return "صفر";

    const suffixes = ["", "هزار", "میلیون", "میلیارد", "تریلیون", "کوآدریلیون", "کوینتیلیون"]; // add more suffixes as needed

    let suffixIndex = 0;

    while (num >= 1000 && suffixIndex < suffixes.length - 1) {
        num /= 1000;
        suffixIndex++;
    }

    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    let persianNumString = num.toString()
    let moreNumber = ''
    if (persianNumString.includes('.')) {
        let splitNumber = persianNumString.split('.')
        console.log(splitNumber)
        let littleNumber = splitNumber[1]
        moreNumber = ((littleNumber + "00").substring(0, 3)) + " " + suffixes[suffixIndex - 1]
        persianNumString = splitNumber[0]

    }

    return persianNumString + " " + suffixes[suffixIndex] + (moreNumber ? " و " : "") + " " + moreNumber;
}
