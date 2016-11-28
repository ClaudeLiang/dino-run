import React from 'react'
import {render} from 'react-dom'
import App from './App'
import createStore from './store/createStore'
import initialState from './store/initialState'
import * as record from './record'
import './style/index.css'
import * as GView from './GA/view'
import * as GA from './GA'

const state = {
    initialState: {...initialState},
    ...initialState
}

const store = createStore(state)

store.subscribe(data => {
    let {actionType, currentState} = data
    if (actionType === 'start') record.clean()
    if (currentState.game.status === 'over' && GA.getState().isLearning)
        GA.restart()
    record.save(currentState)
    renderToDom()
})

window.onresize = () => {
    window.location.reload()
}

function renderToDom(state) {
    return render(
        <App
            state={state || store.getState()}
            actions={store.actions}
            record={record}
            GA={GA}
        />,
        document.getElementById('root')
    )
}

GView.setStore(store)
record.setRender(renderToDom)

const {PLAYING} = store.actions
let requestId = null
function playing() {
    requestId = requestAnimationFrame(playing)
    PLAYING()
}
function over() {
    cancelAnimationFrame(requestId)
}

renderToDom()
playing()
