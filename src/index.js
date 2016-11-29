import React from 'react'
import {render} from 'react-dom'
import App from './App'
import createStore from './store/createStore'
import _initialState from './store/initialState'
import * as record from './record'
import './style/index.css'
import * as GView from './GA/view'
import * as GA from './GA'

const initialState = {
    ..._initialState,
    dinoArr: objArrGen(_initialState.dino),
    gameArr: objArrGen(_initialState.game),
    barrierArr: objArrGen(_initialState.barrier)
}
const state = {
    initialState: {...initialState},
    ...initialState
}
function objArrGen(Obj) {
    return [
        {...Obj},
        {...Obj},
        {...Obj},
        {...Obj}
    ]
}

const store = createStore(state)

store.subscribe(data => {
    let {actionType, currentState} = data
    let {isLearning} = GA.getState()
    if (actionType === 'start') record.clean()
    isLearning && over()
    if (currentState.game.status === 'over' && isLearning)
        GA.restart()
    record.save(currentState)
    renderToDom(null, isLearning && GView.getContainer())
})

function renderToDom(state, container) {
    return render(container || (
        <App
            state={state || store.getState()}
            actions={store.actions}
            record={record}
            GA={GA}
        />
    ), document.getElementById('root'))
}

GView.setStore(store)
GA.setRender(renderToDom)
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

window.onresize = () => {
    window.location.reload()
}
