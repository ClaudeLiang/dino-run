let record = getInitialRecord()
let render = () => {}

function getInitialRecord() {
    return []
}

export const setRender = renderFunc => {
    render = renderFunc
}

export const save = state => {
    record.push(state)
}

export const getRecord = () => {
    return record
}

export const replay = () => {
    let count = 0
    // let requestId = null
    read()
    function read() {
        if (count >= record.length) return
        render(record[count])
        count++
        requestAnimationFrame(read)
    }
}

export const clean = () => {
    record = getInitialRecord()
}
