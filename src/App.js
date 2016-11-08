import React from 'react'
import Dino from './components/Dino'

export default ({state, actions}) => {
    const {dino} = state
    const {isRunning, isJumping} = dino
    const {JUMP} = actions
    const onJump = isRunning && !isJumping && JUMP

    return (
        <div className="scene" onMouseDown={onJump}>
            <Dino dino={dino} />
        </div>
    )
}
