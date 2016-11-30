import React from 'react'
import Dino from '../components/Dino'
import Barrier from '../components/Barrier'

export default ({state, actions, id, current}) => {
    const {dinoArr, barrierArr, gameArr} = state
    const dino = dinoArr[id]
    const barrier = barrierArr[id]
    const {isRunning, isJumping} = dino
    const {value, binary} = current || {}

    return (
        <div className="scene">
            <Dino dino={dino} />
            <Barrier barrier={barrier} />
            <div className="ground"></div>
            <span>{id}</span>
            <label className="score">score: {gameArr[id].score}</label>
            <br />
            <label className="x">{value}-{binary}</label>
        </div>
    )
}
