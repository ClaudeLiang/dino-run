export function getScreenWidth() {
    return document.body.offsetWidth
}

export function getClassElm(className) {
    return document.querySelector('.' + className)
}

export function getLastClassElm(className) {
    let doms = document.querySelectorAll('.' + className)
    return doms[doms.length - 1]
}

export function getIndexClassElm(className, index) {
    let doms = document.querySelectorAll('.' + className)
    return doms[index]
}
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

export function sortWithProp(arr, prop = 'fitness') {
    return arr.sort(function (a, b) {return b[prop] - a[prop]})
}

export function figureProbability(arr, prop = 'fitness') {
    let sum = 0
    arr.map(x => {sum += x[prop]})
    let pArr = arr.map(x => x[prop] / sum)
    return pArr
}

export function expendArr(arr) {
    let numArr = figureProbability(arr).map(elm => parseInt(elm * 10))
    let eArr = []
    numArr.map((n, idx) => {
        for (let i = 0; i < n; i++) eArr.push(arr[idx])
    })
    return eArr
}

// roulette method
export function getPArr(arr, num) {
    let pArr = figureProbability(arr)
    let resultArr = []
    for (let i in pArr)
        resultArr.push((resultArr[i - 1] || 0) + (pArr[i - 1] || 0))
    return resultArr
}
