export const PLAYING = state => {
    if (state.game.status === 'over') return state
    return BARRIER_MOVE(BARRIER_CREATE(FREE_FALL(running(state))))
}

export const running = state => {
    let game = {...state.game}
    let dino = {...state.dino}
    let {height, footSteps, footStepGap} = dino
    let now = Date.now()
    game.score = parseInt((now - game.timestamp) / 100)
    dino.footStep = footSteps[parseInt(now / footStepGap) % 4]
    if (collisitionDetection(state)) [game, dino] = [over(state).game, over(state).dino]
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
        if (targetDistance < range.max) return {distance: targetDistance}
    })
    return {
        ...state,
        barrier
    }
}

export const start = state => {
    let game = {...state.game}
    let dino = {...state.dino}
    game.status = 'playing'
    game.timestamp = Date.now()
    game.score = 0
    dino.isRunning = true
    return {
        ...state,
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

function collisitionDetection (state) {
    let {barrier, dino} = state
    let {left, width, size} = dino
    let dinoRight = document.body.offsetWidth - size.left - size.width
    let dead = false
    barrier.list.map(b => {
        console.log(dinoRight, b.distance, barrier.size.width)
        if (dinoRight === b.distance + barrier.size.width) dead = true
        else return b
    })
    return dead
}
