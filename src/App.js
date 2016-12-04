import React from 'react'
import Dino from './components/Dino'
import Barrier from './components/Barrier'

export default ({state, actions, record, GA}) => {
    const {dino, barrier, game} = state
    const {isRunning, isJumping} = dino
    const {JUMP_UP, start} = actions
    const {getRecord, replay} = record
    const onJump = isRunning && !isJumping && JUMP_UP
    const onStart = !isRunning && start
    const onReplay = !isRunning && getRecord().length > 0 && replay
    const onLearnGA = !isRunning && GA

    return (
        <div className="scene" onTouchStart={onJump}>
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <button className="start" onTouchStart={onStart}>START</button>
            <button className="replay" onTouchStart={onReplay}>REVIEW</button>
            <button className="learn" onTouchStart={onLearnGA}>LEARN</button>
            <label className="score">score: {game.score}</label>
        </div>
    )
}
