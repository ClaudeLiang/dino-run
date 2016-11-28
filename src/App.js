import React from 'react'
import Dino from './components/Dino'
import Barrier from './components/Barrier'

export default ({state, actions, record = {}, GA = {}}) => {
    const {dino, barrier, game} = state
    const {isRunning, isJumping} = dino
    const {JUMP_UP, start, over} = actions
    const {getRecord, replay, clean} = record
    const {learn, getState} = GA
    const onJump = isRunning && !isJumping && JUMP_UP
    const onStart = !isRunning && start
    // console.log(isRunning)
    const onReplay = !isRunning && getRecord && getRecord().length > 0 && replay
    const onLearn = !isRunning && learn
    const GAState = getState && getState()
    const showLearnInfo = getState && getState().isLearning
    const display = showLearnInfo ? 'inline' : 'none'

    return (
        <div className="scene" onTouchStart={onJump}>
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <button className="start" onTouchStart={onStart}>START</button>
            <button className="replay" onTouchStart={onReplay}>REVIEW</button>
            <button className="learn" onTouchStart={onLearn}>LEARN</button>
            <label className="score">score: {game.score}</label>
            <span style={{display: display}}>
                <br />
                <label className="generation">generation: {GAState && GAState.generation}</label>
                <br />
                <label className="x">{GAState && GAState.x} = {GAState && GAState.xBinary}</label>
            </span>
        </div>
    )
}
