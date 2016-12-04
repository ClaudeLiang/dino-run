import {getStore, getContainer, setCurrentArr} from './view'
import {
    getScreenWidth, getIndexClassElm, batch, binarify,
    decimalfy, sortWithProp, createObjWithDecimal, createObjWithBinary
} from './utils'

const DINO_RIGHT = getScreenWidth() - 50
const initState = {
    isLearning: false,
    generation: 0,
    arr: null,
    valueStateArr: [],
    maxArr: []
}

let state = initState
let store = {}
let requestId = null
let subId = null
let render = () => {}

const argsWithBarrier = [0, 1, 2, 3, 4]

function log() {
    for (let i = 0; i < 4; i++)
        console.log(i, ':', state.arr[i].value, ':', state.arr[i].binary)
}

function selection(arr) {
    let max = [state.maxArr[0].value, state.maxArr[1].value]
    let choices = [
        createObjWithDecimal(max[0]),
        createObjWithDecimal(max[1])
    ]
    return [choices[0], choices[1], {}, {}]
}

function crossover(arr) {
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
        createObjWithBinary(newBinaries[0]),
        createObjWithBinary(newBinaries[1])
    ]
    if (arr[1].value === elm2.value) arr = crossover(arr)
    return [arr[0], arr[1], elm2, elm3]
}

function mutation(arr) {
    let ps = [Math.random(), Math.random()]
    ps.map((p, i) => {
        if (p > 0.6) {
            let rand = parseInt(Math.random() * 8)
            let binary = arr[i + 2].binary.split('')
            binary[rand] = 1 - binary[rand]
            binary = binary.join('')
            arr[i + 2] = createObjWithBinary(binary)
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
    }
    return arr
}

function getValue() {
    let value = parseInt(Math.random() * 256 - 1)
    if (state.valueStateArr[value]) return getValue()
    return value
}

function setValue(value, fitness) {
    if (!!state.valueStateArr[value] && state.valueStateArr[value] >= value) return
    state.valueStateArr[value] = fitness
    state.maxArr = state.maxArr.filter(s => s.value !== value)
    state.maxArr.push({value, fitness})
    state.maxArr = sortWithProp(state.maxArr)
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
        sortWithProp(state.arr)
        setArrValue(state.arr)
        state.arr = mutation(crossover(selection(state.arr)))
    }
    setCurrentArr(state.arr)
    log()
    const {start} = store.actions
    start()
    subscribeGame()
}

function subscribeGame() {
    const {JUMP_UP_ID} = store.actions
    subId && cancelAnimationFrame(subId)
    subscribe()
    function subscribe() {
        for (let id = 0; id < 4; id++) {
            let height = parseInt(getIndexClassElm('dino', id).style.top)
            let barriers = getIndexClassElm('scene', id).querySelectorAll('.barrier')
            let nextBarrier = {barrier: null, minDis: 999}
            Array.prototype.map.call(barriers, barrier => {
                let dis = DINO_RIGHT - parseInt(barrier.style.right)
                if (dis > 0 && dis < nextBarrier.minDis) nextBarrier = {barrier, minDis: dis}
            })
            let {barrier} = nextBarrier
            let _distance = barrier ? (DINO_RIGHT - parseInt(barrier.style.right)) : DINO_RIGHT
            if (height === 100 && _distance > 0 && _distance <= state.arr[id].value) {
                if (!store.getState().dinoArr[id].isJumping) {
                    JUMP_UP_ID(id)
                }
            }
        }
        subId = requestAnimationFrame(subscribe)
    }
}

export const learn = () => {
    console.clear()
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

export const getState = () => {
    return state
}

export const setRender = renderFunc => {
    render = renderFunc
}
