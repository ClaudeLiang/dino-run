export const F = x => 1 / (1 + Math.exp(-x))

export const Perceptron = function (
    inputs = [[0, 0]],
    threshold = 0,
    F = x => 1 / (1 + Math.exp(-x))
) {
    this.F = F
    this.input = inputs.map((input, idx) =>
        ({id: idx + this.__proto__.maxId, value: input[0], weight: input[1]})
    )
    this.threshold = threshold
    this.__proto__.maxId += inputs.length
}
Perceptron.prototype.output = function () {
    let sum = 0
    this.input.map(i => sum += i.value * i.weight)
    sum -= this.threshold
    return this.F(sum)
}
Perceptron.prototype.maxId = 0

export const Layer = function (Perceptrons) {
    this.Perceptrons = Perceptrons
}

export let network = function (inputLayer, hideLayer, outputLayer) {
    this.inputLayer = inputLayer
    this.hideLayer = hideLayer
    this.outputLayer = outputLayer
}
