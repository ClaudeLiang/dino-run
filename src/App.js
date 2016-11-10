import React from 'react'
import Dino from './components/Dino'
import Barrier from './components/Barrier'

export default ({state, actions}) => {
    const {dino, barrier, game} = state
    const {isRunning, isJumping} = dino
    const {JUMP_UP, start, over} = actions
    const onJump = isRunning && !isJumping && JUMP_UP
    const onStart = !isRunning && start
    const onOver = isRunning && over

    return (
        <div className="scene" onMouseDown={onJump}>
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <button onMouseDown={onStart}>START</button>
            <button onMouseDown={onOver}>OVER</button>
            <label className="score">{game.score}</label>
        </div>
    )
}
