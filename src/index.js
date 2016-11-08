import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import createStore from './store/createStore'
import initialState from './store/initialState'
import './style/index.css'

const state = {
    initialState: {...initialState},
    ...initialState
}

const store = createStore(state)

store.subscribe(data => {
    let {actionType, currentState} = data
    if (actionType === 'JUMP') renderToDom()
})

function renderToDom(state) {
    console.log('render')
    return ReactDOM.render(
      <App state={state || store.getState()} actions={store.actions} />,
      document.getElementById('root')
    )
}

let requestId = null
function playing() {
    requestId = requestAnimationFrame(playing)
}
function over() {
    cancelAnimationFrame(requestId)
}

renderToDom()
playing()
