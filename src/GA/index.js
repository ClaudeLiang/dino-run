import {renderApp, getStore, getContainer} from './view'
import {
    getClassElm, getLastClassElm, getIndexClassElm,
    batch, binarify, decimalfy, sortWithProp, expendArr
} from './utils'

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

export function choose(arr) {
    // let eArr = expendArr(arr)
    // let iArr = [
    //     parseInt(Math.random() * eArr.length),
    //     parseInt(Math.random() * eArr.length),
    //     parseInt(Math.random() * eArr.length),
    //     parseInt(Math.random() * eArr.length),
    // ]
    let max = [state.maxArr[0].value, state.maxArr[1].value]
    let choices = [
        {value: max[0], binary: binarify(max[0]), fitness: 0},
        {value: max[1], binary: binarify(max[1]), fitness: 0}
    ]
    return [choices[0], choices[1], {}, {}]
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
        if (p > 0.4) {
            let rand = parseInt(Math.random() * 8)
            let binary = arr[i + 2].binary.split('')
            // console.log('from:', arr[i + 2].binary)
            binary[rand] = 1 - binary[rand]
            binary = binary.join('')
            // console.log('to:', binary)
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
    if (!!state.valueStateArr[value]) return
    state.valueStateArr[value] = fitness
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
        // for (let i = 0; i < 4; i++)
        //     console.log(i, ':', state.arr[i].value, ':', state.arr[i].binary, ':', state.arr[i].fitness)
        sortWithProp(state.arr)
        setArrValue(state.arr)
        state.arr = mutation(exchange(choose(sortWithProp(state.arr))))
    }
    for (let i = 0; i < 4; i++) console.log(i, ':', state.arr[i].value, ':', state.arr[i].binary)
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
                let dis = 275 - parseInt(barrier.style.right)
                if (dis > 0 && dis < nextBarrier.minDis) nextBarrier = {barrier, minDis: dis}
            })
            let {barrier} = nextBarrier
            let _distance = barrier ? (275 - parseInt(barrier.style.right)) : 275
            if (height === 100 && _distance > 0 && _distance <= state.arr[id].value) {
                if (!store.getState().dinoArr[id].isJumping) {
                    console.info('jump:', id)
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
