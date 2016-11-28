const e = new TouchEvent('touchstart', {
    bubbles: true
})

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
