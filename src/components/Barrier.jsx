import React from 'react'

export default ({barrier}) => {
    const {list} = barrier
    return (
        <div>
            {
                list.map(b => {
                    if (!b) return
                    let style = new Object()
                    style.right = b.distance
                    return <div key={b.timestamp} className="barrier" style={style}></div>
                })
            }
        </div>
    )
}
