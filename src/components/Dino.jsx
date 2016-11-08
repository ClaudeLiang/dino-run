import React from 'react'

export default ({dino}) => {
    const {height = 0} = dino
    let style = {
        transform: `translateY(-${height}px)`
    }
    return <div className="dino" style={style}></div>
}
