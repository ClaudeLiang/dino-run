const elm = document.querySelector('.scene')
const startElm = document.querySelector('.start')
const triggerTouchStart = elm => {
    const e = new TouchEvent('touchstart', {
        bubbles: true
    })
    elm.dispatchEvent(e)
}
const initState = {
    status: 'over',
    times: 0,
    bestX: 0,
    bestY: 0,
    sigmoid: x => {
        return 1 / (1 + Math.exp(-x))
    }
}

let state = {}

function init() {
    state = initState
}

function update() {

}

function startGame() {
    triggerTouchStart(startElm)
}

function subscribeGame() {

}

function train() {
    
}

export const learn = () => {
    init()
    train()
}
