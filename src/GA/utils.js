// const e = new TouchEvent('touchstart', {
//     bubbles: true
// })
//
// export const triggerTouchStart = elm => {
//     try {
//         elm.dispatchEvent(e)
//     } catch (err) {}
// }
//
// export function getClassElm(className) {
//     return document.querySelector('.' + className)
// }
//
// export function getLastClassElm(className) {
//     let doms = document.querySelectorAll('.' + className)
//     return doms[doms.length - 1]
// }
//
// export function getIndexClassElm(className, index) {
//     let doms = document.querySelectorAll('.' + className)
//     return doms[index]
// }
const _args = [0, 1, 2, 3]

export function batch(func, args = _args) {
    args.map(arg => {func(arg)})
}

export function binarify(num, format = '00000000') {
    let str = format + num.toString(2)
    return str.substring(str.length - format.length, str.length)
}

export function decimalfy(num, base = 2) {
    return parseInt(num, base)
}

export function sortWithProp(arr, prop = 'binary') {
    return arr.sort(function (a, b) {return a[prop] - b[prop]})
}

export function figureProbability(arr, prop = 'fitness') {
    let sum = 0
    arr.map(x => {sum += x[prop]})
    let pArr = arr.map(x => x[prop] / sum)
    return pArr
}

// roulette method
export function getPArr(arr, num) {
    let pArr = figureProbability(arr)
    let resultArr = []
    for (let i in pArr)
        resultArr.push((resultArr[i - 1] || 0) + (pArr[i - 1] || 0))
    return resultArr
}
