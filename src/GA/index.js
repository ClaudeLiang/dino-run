import {renderApp, getStore, getContainer} from './view'
import {
    getClassElm, getLastClassElm, getIndexClassElm,
    batch, binarify, decimalfy, sortWithProp, expendArr
} from './utils'

const initState = {
    isLearning: false,
    generation: 0,
    arr: null,
    valueStateArr: {}
}

let state = initState
let store = {}
let requestId = null
let subId = null
let render = () => {}

const argsWithBarrier = [0, 1, 2, 3, 4]

export function choose(arr) {
    let eArr = expendArr(arr)
    let i0 = parseInt(Math.random() * eArr.length)
    let i1 = parseInt(Math.random() * eArr.length)
    console.log(i0, i1)
    return [eArr[i0], eArr[i1], {}, {}]
}

export function exchange(arr) {
    let rand = parseInt(Math.random() * 8) + 1
    let binaries = [arr[0].binary, arr[1].binary]
    let [f0, f1, e0, e1] = [
        binaries[0].substring(0, rand),
        binaries[1].substring(0, rand),
        binaries[0].substring(rand, 8),
        binaries[1].substring(rand, 8)
    ]
    let newBinaries = [f0 + e1, f1 + e0]
    let [elm2, elm3] = [
        {value: decimalfy(newBinaries[0]), binary: newBinaries[0], fitness: 0},
        {value: decimalfy(newBinaries[1]), binary: newBinaries[1], fitness: 0}
    ]
    // console.log(arr[0], arr[1], '-->', elm2, elm3)
    return [arr[0], arr[1], elm2, elm3]
}

export function mutation(arr) {
    let ps = [Math.random(), Math.random()]
    ps.map((p, i) => {
        if (p > 0.2) {
            let rand = parseInt(Math.random() * 8)
            let binary = arr[i + 2].binary.split('')
            console.log('from:', arr[i + 2].binary)
            binary[rand] = 1 - binary[rand]
            binary = binary.join('')
            console.log('to:', binary)
            arr[i + 2] = {value: decimalfy(binary), binary: binary, fitness: 0}
            // console.log(i + 2, 'mutation')
        }
    })
    return arr
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
        // console.log(i, ':', value)
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

function setArrValue(arr) {
    arr.map(elm => {
        if (elm.value > -1) setValue(elm.value, elm.fitness)
    })
}

function startGame() {
    console.log('generation:', state.generation++)

    if (!state.arr) {
        state.arr = initArr()
        setArrValue(state.arr)
    } else {
        for (let i = 0; i < 4; i++)
            console.log(i, ':', state.arr[i].value, ':', state.arr[i].binary, ':', state.arr[i].fitness)
        setArrValue(state.arr)
        state.arr = mutation(exchange(choose(sortWithProp(state.arr))))
    }
    // for (let i = 0; i < 4; i++) console.log(i, ':', state.arr[i].value, ':', state.arr[i].binary)
    const {start} = store.actions
    start()
    subscribeGame()
}

function subscribeGame() {
    const {JUMP_UP_ID} = store.actions
    subId && cancelAnimationFrame(subId)
    subscribe()
    function subscribe() {
        let _distance = getClassElm('barrier') ?
            parseInt(getLastClassElm('barrier').style.right) : 0
        let height = parseInt(getClassElm('dino').style.top)
        _distance = 275 - _distance
        if (height === 100 && _distance > 0)
            for (let id = 0; id < 4; id++)
                if (_distance <= state.arr[id].value) {
                    if (!store.getState().dinoArr[id].isJumping) JUMP_UP_ID(id)
                }
        subId = requestAnimationFrame(subscribe)
    }
}

export const learn = () => {
    state.isLearning = true
    store = getStore()
    const {PLAYING} = store.actions
    store.subscribe(data => {
        let {actionType, currentState} = data
        let liveNum = 0
        for (let id in currentState.gameArr) {
            if (currentState.gameArr[id].status == 'over' && !!state.arr)
                state.arr[id].fitness = Number(getIndexClassElm('score', id).innerText.match(/[0-9]+/))
            else liveNum++
        }
        if (liveNum === 0) startGame()
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
