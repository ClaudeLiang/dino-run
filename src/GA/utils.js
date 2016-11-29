const e = new TouchEvent('touchstart', {
    bubbles: true
})

const _args = [0, 1, 2, 3]

export const triggerTouchStart = elm => {
    try {
        elm.dispatchEvent(e)
    } catch (err) {}
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

export function batch(func, args = _args) {
    args.map(arg => {func(arg)})
}
