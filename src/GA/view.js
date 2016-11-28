import React from 'react'
import {render} from 'react-dom'
import App from '../App'
import {createStore} from 'relite'

let storeArr = {}

export const setStore = store => {
    storeArr = [
        {...store},
        {...store},
        {...store},
        {...store}
    ]
}

export const renderApp = () => {
    render((
        <div>
            <div className="g-container"><App state={storeArr[0].getState()} actions={storeArr[0].actions} /></div>
            <div className="g-container"><App state={storeArr[1].getState()} actions={storeArr[1].actions} /></div>
            <div className="g-container"><App state={storeArr[2].getState()} actions={storeArr[2].actions} /></div>
            <div className="g-container"><App state={storeArr[3].getState()} actions={storeArr[3].actions} /></div>
        </div>
    ), document.getElementById('root'))
}
