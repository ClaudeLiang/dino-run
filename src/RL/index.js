import './rl'
import {
    getScreenWidth, getClassElm, getIndexClassElm
} from '../GA/utils'

const DINO_RIGHT = getScreenWidth() - 50
const initState = {
    actions: [0, 1],
    states: [DINO_RIGHT, DINO_RIGHT],
    valueStateArr: [],
    maxArr: []
}

let state = initState
let requestId = null
let subId = null

function train() {
    var env = {};
    env.getNumStates = function () {return 2}
    env.getMaxNumActions = function () {return 2}

    var spec = { alpha: 0.01 }
    agent = new RL.DQNAgent(env, spec)

    for (var i = 0; i < 100; i++) {
    }
    for (let i = 0; i < DINO_RIGHT; i++) {
        var action = agent.act([i]);
        agent.learn(i > 50 ? 1 : 0);
    }

}

function getValue() {
    let value = parseInt(Math.random() * DINO_RIGHT - 1)
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
        sortWithProp(state.arr)
        setArrValue(state.arr)
        state.arr = mutation(crossover(choose(sortWithProp(state.arr))))
    }
    setCurrentArr(state.arr)
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
                let dis = DINO_RIGHT - parseInt(barrier.style.right)
                if (dis > 0 && dis < nextBarrier.minDis) nextBarrier = {barrier, minDis: dis}
            })
            let {barrier} = nextBarrier
            let _distance = barrier ? (DINO_RIGHT - parseInt(barrier.style.right)) : DINO_RIGHT
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

export const learnRl = () => {
    console.clear()
    train()
    startGame()
}

export const getState = () => {
    return state
}
