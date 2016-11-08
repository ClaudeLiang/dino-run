export const RUNNING = state => {
    let dino = {...state.dino}

}

export const JUMP_UP = state => {
    let dino = {...state.dino}
    dino.status = 'up'
    dino.isJumping = true
    dino.targetHeight = dino.range.min
    dino.timestamp = Date.now()
    return {
        ...state,
        dino
    }
}

export const DROP_DOWN = state => {
    let dino = {...state.dino}
    dino.status = 'down'
    dino.targetHeight = dino.range.max
    dino.timestamp = Date.now()
    return {
        ...state,
        dino
    }
}
