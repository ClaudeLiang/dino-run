import React from 'react'

export default ({dino}) => {
    const {height} = dino
    let style = {
        top: height
    }
    let className = `dino ${dino.footStep}`
    return <div className={className} style={style}></div>
}
