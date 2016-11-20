const e = new TouchEvent('touchstart', {
    bubbles: true
})
const triggerTouchStart = elm => {
    try {
        elm.dispatchEvent(e)
    } catch (err) {}
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
let score = -1
let distance = 0
let intervalId = null
let xState = {}

function getClassElm(className) {
    return document.querySelector('.' + className)
}

function getLastClassElm(className) {
    let doms = document.querySelectorAll('.' + className)
    return doms[doms.length - 1]
}

function init() {
    state = initState
    score = -1
    xState = {}
}

function getX() {
    let x = parseInt(Math.random() * 275 - 1)
    if (xState[x]) return getX()
    return x
}

function updateX(x, y) {
    xState[x] = y
}

function startGame() {
    if (state.bestY < score) {
        state.bestX = distance
        state.bestY = score
        updateX(distance, score)
    }
    console.info('times:', state.times,
        'x:', distance,
        'y:', score,
        'bestX:', state.bestX,
        'bestY:', state.bestY)
    score = -1
    distance = getX()
    state.times++
    triggerTouchStart(getClassElm('start'))
    subscribeGame()

    // clearInterval(intervalId)
    // intervalId = setInterval(() => {
    //     triggerTouchStart(getClassElm('scene'))
    // }, gapTime)
}

function subscribeGame() {
    let id = null
    let timestamp = Date.now()
    let requestId = null
    subscribe()
    function subscribe() {
        let now = Date.now()
        let _distance = getClassElm('barrier') ?
            parseInt(getLastClassElm('barrier').style.right) : 0
        _distance = 275 - _distance
        if (now - timestamp > 2000) {
            timestamp = now
            let _score = Number(getClassElm('score').innerText)
            if (_score === score) {
                cancelAnimationFrame(requestId)
                startGame()
                return
            } else {
                score = _score
            }
        }
        if (_distance > 0 && _distance <= distance) {
            triggerTouchStart(getClassElm('scene'))
        }
        requestId = requestAnimationFrame(subscribe)
    }
}

export const learn = () => {
    init()
    startGame()
}

export const restart = () => {
    // setTimeout(() => {
    //     startGame()
    // }, 500)
}
