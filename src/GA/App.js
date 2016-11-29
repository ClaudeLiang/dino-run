import React from 'react'
import Dino from '../components/Dino'
import Barrier from '../components/Barrier'

export default ({state, actions, id, GA = {}}) => {
    const {dinoArr, barrierArr, gameArr} = state
    const dino = dinoArr[id]
    const barrier = barrierArr[id]
    const {isRunning, isJumping} = dino
    const {JUMP_UP_ID, start, over} = actions
    const {learn, getState} = GA
    const onJump = () => {console.log(id);JUMP_UP_ID(id)}
    const onStart = () => {if (isRunning) return; console.log(id); start(id)}
    const onLearn = !isRunning && learn
    const GAState = getState && getState()
    const showLearnInfo = getState && getState().isLearning
    const display = showLearnInfo ? 'inline' : 'none'

    return (
        <div className="scene" onTouchStart={onJump}>
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <span>{id}</span>
            <button className="start" onTouchStart={onStart}>START</button>
            <label className="score">score: {gameArr[id].score}</label>
            <span style={{display: display}}>
                <br />
                <label className="generation">generation: {GAState && GAState.generation}</label>
                <br />
                <label className="x">{GAState && GAState.x} = {GAState && GAState.xBinary}</label>
            </span>
        </div>
    )
}
