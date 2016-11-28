import React from 'react'
import App from './App'
import * as actions from './actions'
import {createStore} from 'relite'

let store = {}

export const setStore = _store => {
    // const {_actions} = _store
    // const newActions = {..._actions, ...actions}
    console.log(_store.getState())
    store = createStore(actions, {..._store.getState()})//{..._store, actions}
    console.log(store.getState())
}

export const getStore = () => {
    return store
}

export const getContainer = () => {
    return (
        <div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={0} /></div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={1} /></div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={2} /></div>
            <div className="g-container"><App state={store.getState()} actions={store.actions} id={3} /></div>
        </div>
    )
}
