export default {
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
        jumpHeight: -80,
        fallHeight: 1,
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
        moveDistance: 2,
        timestamp: 0,
        gap: 1000,
        probability: 50,
        // collisition
    }
}
