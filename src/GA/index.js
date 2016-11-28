import {renderApp} from './view'
import {triggerTouchStart, getClassElm, getLastClassElm} from './utils'

const initState = {
    isLearning: false,
    format: '00000000',
    times: 0,
    bestX: 0,
    bestY: 0,
    population: 3,
    generation: 0,
    x: 0,
    score: -1,
    xBinary: '00000000'
}

Object.defineProperty(initState, 'setX', {
    set: function (num) {
        this.x = num
        let str = this.format + num.toString(2)
        this.xBinary = str.substring(str.length - this.format.length, str.length)
    }
})

let state = initState
let xState = {}

function getX() {
    let x = parseInt(Math.random() * 275 - 1)
    if (xState[x]) return getX()
    return x
}

function updateX(x, y) {
    xState[x] = y
}

function startGame() {
    if (state.bestY < state.score) {
        state.bestX = state.x
        state.bestY = state.score
        updateX(state.x, state.score)
    }
    // console.info('times:', state.times,
    //     'x:', state.x,
    //     'y:', state.score,
    //     'bestX:', state.bestX,
    //     'bestY:', state.bestY)
    state.score = -1
    state.setX = getX()
    state.times++
    if (state.times % 4 === 1) state.generation++
    triggerTouchStart(getClassElm('start'))
    subscribeGame()
}

function subscribeGame() {
    subscribe()
    function subscribe() {
        state.score = Number(getClassElm('score').innerText.match(/[0-9][0-9]*/g)[0])
        let _distance = getClassElm('barrier') ?
            parseInt(getLastClassElm('barrier').style.right) : 0
        let height = parseInt(getClassElm('dino').style.top)
        _distance = 275 - _distance
        if (height === 100 && _distance > 0 && _distance <= state.x) {
            triggerTouchStart(getClassElm('jump'))
        }
        requestAnimationFrame(subscribe)
    }
}

export const learn = () => {
    state.isLearning = true
    renderApp()
    startGame()
}

export const restart = () => {
    setTimeout(() => {
        startGame()
    }, 500)
}

export const getState = () => {
    return state
}
