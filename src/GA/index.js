import {renderApp, getStore, getContainer} from './view'
import {getClassElm, getLastClassElm, batch, binarify, decimalfy, sortWithProp} from './utils'

const initState = {
    isLearning: false,
    generation: 0,
    arr: null,
    valueStateArr: {}
}

let state = initState
let store = {}
let requestId = null
let render = () => {}

const argsWithBarrier = [0, 1, 2, 3, 4]

export function choose(arr) {

}

export function exchange() {

}

export function mutation() {

}

function initArr() {
    let arr = []
    for (let i = 0; i < 4; i++) {
        let value = getValue()
        arr.push({
            value,
            binary: binarify(value),
            fitness: 0
        })
    }
    return arr
}

function getValue() {
    let value = parseInt(Math.random() * 275 - 1)
    if (state.valueStateArr[value]) return getValue()
    return value
}

function setValue(value, fitness) {
    state.valueStateArr[value] = fitness
}

function startGame() {
    state.arr.map(elm => {
        if (elm.value > -1) setValue(elm.value, elm.fitness)
    })
    if (!state.arr) {
        state.arr = initArr()
    } else {
        state.arr = exchange(choose(sortWithProp(state.arr)))
    }
    const {start} = store.actions
    batch(start)
    subscribeGame()
}

function subscribeGame() {
    const {JUMP_UP_ID} = store.actions
    subscribe()
    function subscribe() {
        // state.score = Number(getClassElm('score').innerText.match(/[0-9][0-9]*/g)[0])
        let _distance = getClassElm('barrier') ?
            parseInt(getLastClassElm('barrier').style.right) : 0
        let height = parseInt(getClassElm('dino').style.top)
        _distance = 275 - _distance
        if (height === 100 && _distance > 0)
            for (let id = 0; id < 4; id++)
                if (_distance <= state.arr[id].value) {
                    JUMP_UP_ID(id)
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
