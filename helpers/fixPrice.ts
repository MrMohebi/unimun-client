export const fixPrice = (number: number) => {

    return number.toString().split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('')

}