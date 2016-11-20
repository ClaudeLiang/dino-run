import React from 'react'
import Dino from './components/Dino'
import Barrier from './components/Barrier'

export default ({state, actions, record, NN}) => {
    const {dino, barrier, game} = state
    const {isRunning, isJumping} = dino
    const {JUMP_UP, start, over} = actions
    const {getRecord, replay, clean} = record
    const {learn} = NN
    const onJump = isRunning && !isJumping && JUMP_UP
    const onStart = !isRunning && start
    const onReplay = !isRunning && getRecord().length > 0 && replay
    const onLearn = !isRunning && learn

    return (
        <div className="scene" onTouchStart={onJump}>
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <button className="start" onTouchStart={onStart}>START</button>
            <button className="replay" onTouchStart={onReplay}>REVIEW</button>
            <button className="learn" onTouchStart={onLearn}>LEARN</button>
            <label className="score">{game.score}</label>
        </div>
    )
}
