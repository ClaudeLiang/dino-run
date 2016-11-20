export default {
    device: {
        width: document.body.offsetWidth,
        height: 143
    },
    game: {
        status: 'over',
        timestamp: 0,
        score: 0
    },
    player: {
        score: 0
    },
    dino: {
        height: 100,
        jumpHeight: -7,
        fallHeight: 3,
        range: {
            min: 30,
            max: 100
        },
        size: {
            width: 40,
            height: 43,
            left: 50
        },
        isRunning: false,
        isJumping: false,
        isRaising: false,
        timestamp: 0,
        footStep: 'normal',
        footSteps: ['left', 'normal', 'right', 'normal'],
        footStepGap: 50
    },
    barrier: {
        range: {
            min: 0,
            max: 320
        },
        size: {
            width: 23,
            height: 46
        },
        list: [],
        moveDistance: 5,
        timestamp: 0,
        gap: 1000,
        probability: 50,
        deviation: 20
    }
}
