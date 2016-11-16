import React from 'react'
import Dino from './components/Dino'
import Barrier from './components/Barrier'

export default ({state, actions, record}) => {
    const {dino, barrier, game} = state
    const {isRunning, isJumping} = dino
    const {JUMP_UP, start, over} = actions
    const {getRecord, replay, clean} = record
    const onJump = isRunning && !isJumping && JUMP_UP
    const onStart = !isRunning && start
    const onReplay = !isRunning && getRecord().length > 0 && replay

    return (
        <div className="scene" onTouchStart={onJump}>
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <button onTouchStart={onStart}>START</button>
            <button onTouchStart={onReplay}>REVIEW</button>
            <label className="score">{game.score}</label>
        </div>
    )
}
