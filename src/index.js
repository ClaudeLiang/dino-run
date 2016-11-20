import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import createStore from './store/createStore'
import initialState from './store/initialState'
import * as record from './record'
import './style/index.css'
import * as NN from './NN'

const state = {
    initialState: {...initialState},
    ...initialState
}

const store = createStore(state)

store.subscribe(data => {
    let {actionType, currentState} = data
    if (actionType === 'start') record.clean()
    if (currentState.game.status === 'over') NN.restart()
    record.save(currentState)
    renderToDom()
})

window.onresize = () => {
    let newWidth = document.body.offsetWidth
    state.initialState.device.width = newWidth
    state.device.width = newWidth
}

function renderToDom(state) {
    return ReactDOM.render(
      <App state={state || store.getState()}
          actions={store.actions}
          record={record}
          NN={NN}
      />,
      document.getElementById('root')
    )
}

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
