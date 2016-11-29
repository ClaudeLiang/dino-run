import {renderApp, getStore, getContainer} from './view'
import {triggerTouchStart, getClassElm, getLastClassElm, batch} from './utils'

const initState = {
    isLearning: false,
    format: '00000000',
    times: 0,
    bestX: 0,
    bestY: 0,
    population: 4,
    generation: 0,
    x: 0,
    score: -1,
    xBinary: '00000000'
}
const argsWithBarrier = [0, 1, 2, 3, 4]

Object.defineProperty(initState, 'setX', {
    set: function (num) {
        this.x = num
        let str = this.format + num.toString(2)
        this.xBinary = str.substring(str.length - this.format.length, str.length)
    }
})

let state = initState
let xState = {}
let store = {}
let requestId = null
let render = () => {}

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
    const {start} = store.actions
    batch(start)
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
            // triggerTouchStart(getClassElm('scene'))
        }
        requestAnimationFrame(subscribe)
    }
}

export const learn = () => {
    state.isLearning = true
    store = getStore()
    const {PLAYING} = store.actions
    store.subscribe(data => {
        let {actionType, currentState} = data
        let liveNum = 0
        console.log(currentState.gameArr)
        for (let id in currentState.gameArr)
            currentState.gameArr[id].status !== 'over' && liveNum++
        if (liveNum === 0) restart()
        render(null, getContainer())
    })
    requestId && cancelAnimationFrame(requestId)
    playing()
    function playing() {
        requestId = requestAnimationFrame(playing)
        batch(PLAYING, argsWithBarrier)
    }
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

export const setRender = renderFunc => {
    render = renderFunc
}
