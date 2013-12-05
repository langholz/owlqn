var debug = require('debug')('owlqn::optimizer');
var numeric = require('numeric');
var array = require('./array');
var defaultMemoryParameter = 10.0;

function validateDifferentiableFunction(value) {
    if (typeof value !== 'object') {
        throw new TypeError('Invalid differentiable function: expected an object');
    } else if (typeof value.compute !== 'function') {
        throw new Error('Invalid differentiable function: expected object to contain a compute function');
    }
}

function validateInitializationVector(value) {
    if (!(value instanceof Array)) {
        throw new TypeError('Invalid optimizer initialization vector: expected an array');
    } else if (value.length <= 0) {
        throw new Error('Invalid optimizer initialization vector: expected length to be larger or equal than one');
    }
}

function validateMemoryParameter(value) {
    if (typeof value !== 'number') {
        throw new TypeError('Invalid optimizer memory parameter: expected a number');
    } else if (value <= 0.0) {
        throw new Error('Invalid optimizer memory parameter: expected the value to be larger or equal to one');
    }
}

function validateL1Weight(value) {
    if (typeof value !== 'number') {
        throw new TypeError('Invalid optimizer l1 weight: expected a number');
    } else if (value < 0.0) {
        throw new Error('Invalid optimizer l1 weight: expected the value to be larger or equal to zero');
    }
}

function evaluateDifferentiableFunction(state) {
    var value = state.differentiableFunction.compute(state.xPrime, state.gradientPrime);
    if (state.l1Weight > 0.0) {
        for (var index = 0; index < state.dimensionality; index++) {
            value += Math.abs(state.xPrime[index]) * state.l1Weight;
        }
    }

    return value;
}

function calculateSteepestDescendantDirection(state) {
    debug('> calculateSteepestDescendantDirection');
    if (state.l1Weight === 0.0) {
        for (var index = 0; index < state.direction.length; index++) {
            state.direction[index] = state.gradient[index] * -1.0;
        }
    } else {
        for (var index = 0; index < state.dimensionality; index++) {
            if ((state.x[index] < 0.0)
                || ((state.x[index] === 0.0) && (state.gradient[index] > state.l1Weight))) {
                state.direction[index] = -state.gradient[index] + state.l1Weight;
            } else if ((state.x[index] > 0.0)
                || (state.x[index] === 0.0 && (state.gradient[index] < -state.l1Weight))) {
                state.direction[index] = -state.gradient[index] - state.l1Weight;
            } else {
                state.direction[index] = 0.0;
            }
        }
    }

    state.steepestDescendantDirection = state.direction.slice();
    debug('< calculateSteepestDescendantDirection');
}

function mapDirectionWithInverseHessian(state) {
    debug('> mapDirectionWithInverseHessian');
    var count = state.sQueue.length;
    if (count > 0) {
        for (var index = count - 1; index >= 0; index--) {
            state.alphas[index] = -numeric.dot(state.direction, state.sQueue[index]) / state.roQueue[index];
            numeric.addeq(state.direction, numeric.mul(state.yQueue[index], state.alphas[index]));
        }

        var lastY = state.yQueue[count - 1];
        var yDotProduct = numeric.dot(lastY, lastY);
        var scalar = state.roQueue[count - 1] / yDotProduct;
        numeric.muleq(state.direction, scalar);

        for (var index = 0; index < count; index++) {
            var beta = numeric.dot(state.yQueue[index], state.direction) / state.roQueue[index];
            numeric.addeq(state.direction, numeric.mul(state.sQueue[index], -state.alphas[index] - beta));
        }
    }

    debug('< mapDirectionWithInverseHessian');
}

function fixDirectionSigns(state) {
    debug('> fixDirectionSigns');
    if (state.l1Weight > 0.0) {
        for (var index = 0; index < state.dimensionality; index++) {
            if ((state.direction[index] * state.steepestDescendantDirection[index]) <= 0.0) {
                state.direction[index] = 0.0;
            }
        }
    }

    debug('< fixDirectionSigns');
}

function updateDirection(state) {
    debug('> updateDirection');
    calculateSteepestDescendantDirection(state);
    mapDirectionWithInverseHessian(state);
    fixDirectionSigns(state);
    debug('< updateDirection');
}

function calculateDirectionDerivative(state) {
    debug('> calculateDirectionDerivative');
    var value = 0.0;
    if (state.l1Weight === 0.0) {
        value = numeric.dot(state.direction, state.gradient);
    } else {
        for (var index = 0; index < state.dimensionality; index++) {
            if (state.direction[index] !== 0.0) {
                if ((state.x[index] < 0.0)
                    || ((state.x[index] === 0.0) && (state.direction[index] < 0.0))) {
                    value += state.direction[index] * (state.gradient[index] - state.l1Weight);
                } else if ((state.x[index] > 0.0)
                    || ((state.x[index] === 0.0) && (state.direction[index] > 0.0))) {
                    value += state.direction[index] * (state.gradient[index] + state.l1Weight);
                }
            }
        }
    }

    debug('< calculateDirectionDerivative');
    return value;
}

function getNextPoint(state, alpha) {
    debug('> getNextPoint');
    state.xPrime = numeric.add(state.x, numeric.mul(state.direction, alpha));
    if (state.l1Weight > 0.0) {
        for (var index = 0; index < state.dimensionality; index++) {
            if (state.x[index] * state.xPrime[index] < 0.0) {
                state.xPrime[index] = 0.0;
            }
        }
    }

    debug('< getNextPoint');
}

function backtrackLineSearch(state) {
    debug('> backtrackLineSearch');
    var directionDerivative = calculateDirectionDerivative(state);
    debug('directionDerivative: ' + directionDerivative);
    if (directionDerivative >= 0.0) {
        throw new Error(
            'Chose a non-descendant direction: Possible error in the provided ' +
            'gradient computation of the differentiable function');
    }

    var alpha = 1.0;
    var backoff = 0.5;
    if (state.iteration === 1) {
        var normalizedDirection = numeric.norm2(state.direction);
        alpha = 1.0 / normalizedDirection;
        backoff = 0.1;
    }

    var c1 = 1e-4;
    var oldValue = state.value;
    do
    {
        getNextPoint(state, alpha);
        state.value = evaluateDifferentiableFunction(state);
        if (state.value > (oldValue + c1 * directionDerivative * alpha)) {
            if (alpha < 1e-30) {
                debug('Exiting backtrackLineSearch since alpha < 1e-30 meaning its unlikely to converge');
                state.value = oldValue;
                break;
            }

            alpha *= backoff;
            debug('.');
        }
    }
    while (state.value > (oldValue + c1 * directionDerivative * alpha));
    debug('< backtrackLineSearch');
}

function optimize(state) {
    debug('> optimize');
    updateDirection(state);
    backtrackLineSearch(state);
    debug('< optimize');
}

function shift(state) {
    debug('> shift');
    if (state.sQueue.length >= state.memoryParameter) {
        state.sQueue.shift();
        state.yQueue.shift();
        state.roQueue.shift();
    }

    var sPrime = numeric.add(state.xPrime, numeric.mul(state.x, -1.0));
    var yPrime = numeric.add(state.gradientPrime, numeric.mul(state.gradient, -1.0));
    var ro = numeric.dot(sPrime, yPrime);
    state.sQueue.push(sPrime);
    state.yQueue.push(yPrime);
    state.roQueue.push(ro);

    array.swap(state.x, state.xPrime);
    array.swap(state.gradient, state.gradientPrime);
    state.iteration++;
    debug('< shift');
}

var Optimizer = function (options) {
    if (typeof options !== 'object') {
        throw new TypeError('Invalid options type');
    }

    validateDifferentiableFunction(options.differentiableFunction);
    validateInitializationVector(options.initializationVector);
    validateL1Weight(options.l1Weight);
    if (typeof options.memoryParameter === 'undefined') {
        options.memoryParameter = defaultMemoryParameter;
    } else {
        validateMemoryParameter(options.memoryParameter);
    }

    var state = {
        differentiableFunction: options.differentiableFunction,
        l1Weight: options.l1Weight,
        memoryParameter: options.memoryParameter,
        x: options.initializationVector.slice(),
        xPrime: options.initializationVector.slice(),
        gradient: array.create(options.initializationVector.length, 0.0),
        gradientPrime: array.create(options.initializationVector.length, 0.0),
        steepestDescendantDirection: array.create(options.initializationVector.length, 0.0),
        direction: array.create(options.initializationVector.length, 0.0),
        alphas: array.create(options.memoryParameter, 0.0),
        iteration: 1,
        value: 0.0,
        dimensionality: options.initializationVector.length,
        sQueue: [],
        yQueue: [],
        roQueue: []
    };

    state.value = evaluateDifferentiableFunction(state);
    state.gradient = state.gradientPrime.slice();
    state.steepestDescendantDirection = state.gradientPrime.slice();

    this.getValue = function () {
        return state.value;
    };

    this.getIteration = function () {
        return state.iteration;
    };

    this.optimize = function () {
        optimize(state);
    };

    this.shift = function () {
        shift(state);
    };

    this.getMinimizedVector = function () {
        return state.xPrime;
    };

    this.xHashChanged = function () {
        return !array.areEqual(state.x, state.xPrime);
    };
};

module.exports = Optimizer;
