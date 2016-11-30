import React from 'react'
import App from './App'
import * as actions from './actions'
import {createStore} from 'relite'

let store = {}
let currentArr = []

export const setStore = _store => {
    store = createStore(actions, {..._store.getState()})
}

export const getStore = () => {
    return store
}

export const setCurrentArr = arr => {
    currentArr = arr
}

export const getContainer = () => {
    return (
        <div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={0} current={currentArr[0]} /></div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={1} current={currentArr[1]} /></div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={2} current={currentArr[2]} /></div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={3} current={currentArr[3]} /></div>
        </div>
    )
}
