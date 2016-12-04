export const PLAYING = (state, id) => {
    if (id === 4) return BARRIER_MOVE(BARRIER_CREATE(state))
    if (state.gameArr[id].status === 'over') return state
    return BARRIER_COPY(FREE_FALL(running( state, id), id), id)
}

export const running = (state, id) => {
    let gameArr = {...state.gameArr}
    let dinoArr = {...state.dinoArr}
    let game = gameArr[id]
    let dino = dinoArr[id]
    let {height, footSteps, footStepGap, isRaising} = dino
    if (isRaising) dino = JUMP_UP_ID(state, id).dinoArr[id]
    let now = Date.now()
    game.score = parseInt((now - game.timestamp) / 100)
    dino.footStep = footSteps[parseInt(now / footStepGap) % 4]
    if (isCollide(state, id)) [game, dino] = [over(state, id).gameArr[id], over(state, id).dinoArr[id]]
    // console.log(id, game.status)
    return {
        ...state,
        dinoArr,
        gameArr
    }
}

export const FREE_FALL = (state, id) => {
    let dinoArr = {...state.dinoArr}
    let dino = dinoArr[id]
    let {height, fallHeight, range} = dino
    dino.height = rangeLimit(height + fallHeight, range)
    dino.isJumping = !(dino.height === range.max)
    return {
        ...state,
        dinoArr
    }
}

export const JUMP_UP_ID = (state, id) => {
    // console.log(id, 'jump')
    if (state.gameArr[id].status === 'over') return state
    let dinoArr = {...state.dinoArr}
    let dino = dinoArr[id]
    let {height, jumpHeight, range} = dino
    dino.height = rangeLimit(height + jumpHeight, range)
    dino.isRaising = !(dino.height === range.min)
    return {
        ...state,
        dinoArr
    }
}

export const BARRIER_CREATE = state => {
    let barrier = {...state.barrier}
    let {list, range, timestamp, gap, probability} = barrier
    let now = Date.now()
    // console.log(gap)
    if (now - timestamp > gap && Math.random() * probability > probability - 1) {
        barrier.timestamp = now
        barrier.list.push({
            timestamp: now,
            distance: 0
        })
    }
    return {
        ...state,
        barrier
    }
}

export const BARRIER_MOVE = state => {
    let barrier = {...state.barrier}
    let {list, range, timestamp, gap, moveDistance} = barrier
    barrier.list = list.map(b => {
        if (!b) return
        let targetDistance = b.distance + moveDistance
        return {distance: targetDistance, timestamp: b.timestamp}
    })
    return {
        ...state,
        barrier
    }
}

export const BARRIER_COPY = (state, id) => {
    let barrierArr = {...state.barrierArr}
    let barrier = {...state.barrier}
    barrierArr[id] = barrier
    return {
        ...state,
        barrierArr
    }
}

export const start = state => {
    let initialState = {...state.initialState}
    let gameArr = {...state.gameArr}
    let dinoArr = {...state.dinoArr}
    for (let i in gameArr) {
        let game = gameArr[i]
        game.status = 'playing'
        game.timestamp = Date.now()
        game.score = 0
    }
    for (let i in dinoArr) {
        let dino = dinoArr[i]
        dino.isRunning = true
    }
    return {
        ...state,
        ...initialState,
        gameArr,
        dinoArr
    }
}

export const over = (state, id) => {
    let gameArr = {...state.gameArr}
    let dinoArr = {...state.dinoArr}
    let game = gameArr[id]
    let dino = dinoArr[id]
    game.status = 'over'
    dino.isRunning = false
    return {
        ...state,
        gameArr,
        dinoArr
    }
}

function rangeLimit(value, range) {
    if (value < range.min) value = range.min
    if (value > range.max) value = range.max
    return value
}

function isCollideWithDeviation(max, min, deviation) {
    return max - min + deviation > 0
}

function isCollide(state, id) {
    let {barrier, dinoArr, device} = state
    let dino = dinoArr[id]
    let dinoPos = {
        bottom: device.height - dino.height - dino.size.height,
        left: device.width - dino.size.width,
        right: device.width - dino.size.width - dino.size.left
    }
    for (let i in barrier.list) {
        let barrierPos = {
            top: barrier.size.height,
            left: barrier.list[i].distance + barrier.size.width,
            right: barrier.list[i].distance
        }
        const {deviation} = barrier
        let isSafe = isCollideWithDeviation(dinoPos.right, barrierPos.left, deviation)
                    || isCollideWithDeviation(barrierPos.right, dinoPos.left, deviation)
                    || isCollideWithDeviation(dinoPos.bottom, barrierPos.top, 0)
        // if (id === 0)
        // console.log(isCollideWithDeviation(dinoPos.right, barrierPos.left, deviation),
        //             isCollideWithDeviation(barrierPos.right, dinoPos.left, deviation),
        //             dinoPos.bottom - barrierPos.top)
        // if (!isSafe) console.log(id, 'dead')
        if (!isSafe) return true
    }
    return false
}
