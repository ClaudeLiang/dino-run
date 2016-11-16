export const PLAYING = state => {
    if (state.game.status === 'over') return state
    return BARRIER_MOVE(BARRIER_CREATE(FREE_FALL(running(state))))
}

export const running = state => {
    let game = {...state.game}
    let dino = {...state.dino}
    let {height, footSteps, footStepGap, isRaising} = dino
    if (isRaising) dino = JUMP_UP(state).dino
    let now = Date.now()
    game.score = parseInt((now - game.timestamp) / 100)
    dino.footStep = footSteps[parseInt(now / footStepGap) % 4]
    if (isCollide(state)) [game, dino] = [over(state).game, over(state).dino]
    return {
        ...state,
        dino,
        game
    }
}

export const FREE_FALL = state => {
    let dino = {...state.dino}
    let {height, fallHeight, range} = dino
    dino.height = rangeLimit(height + fallHeight, range)
    return {
        ...state,
        dino
    }
}

export const JUMP_UP = state => {
    let dino = {...state.dino}
    let {height, jumpHeight, range} = dino
    dino.height = rangeLimit(height + jumpHeight, range)
    dino.isRaising = !(dino.height === range.min)
    return {
        ...state,
        dino
    }
}

export const BARRIER_CREATE = state => {
    let barrier = {...state.barrier}
    let {list, range, timestamp, gap, probability} = barrier
    let now = Date.now()
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
        return {distance: targetDistance}
    })
    return {
        ...state,
        barrier
    }
}

export const start = state => {
    let game = {...state.game}
    let dino = {...state.dino}
    let initialState = {...state.initialState}
    game.status = 'playing'
    game.timestamp = Date.now()
    game.score = 0
    dino.isRunning = true
    return {
        ...state,
        ...initialState,
        game,
        dino
    }
}

export const over = state => {
    let game = {...state.game}
    let dino = {...state.dino}
    game.status = 'over'
    dino.isRunning = false
    return {
        ...state,
        game,
        dino
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

function isCollide(state) {
    let {barrier, dino, device} = state
    let dinoPos = {
        bottom: device.height - dino.height - dino.range.min,
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
        // console.log(isCollideWithDeviation(dinoPos.right, barrierPos.left, deviation),
        //             isCollideWithDeviation(barrierPos.right, dinoPos.left, deviation),
        //             isCollideWithDeviation(dinoPos.bottom, barrierPos.top, 0))
        if (!isSafe) return true
    }
    return false
}
