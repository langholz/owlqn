/**
 * @title LeastSquares API
 * @author Elmar Langholz
 */

var debug = require('debug')('leastSquares');
var numeric = require('numeric');
var validate = require('./validate');

/**
 * Create a LeastSquaresOptions object
 * @class LeastSquaresOptions
 * @member {number[number[]]} features The feature matrix to process.
 * @member {number[]} labels The corresponding labels for the provided features.
 * @member {number} [l2Weight] The L2 weight to use for the least squares problem. If not provided, 0.0 is used.
 */

/**
 * Create a LeastSquares object
 * @class LeastSquares
 */
/**
 * Initializes a new instance of the `LeastSquares`.
 * @function LeastSquares
 * @param {LeastSquaresOptions} options The options to initialize the least squares problem with.
 */
/**
 * Retrieves the number of feature instances used to train the model.
 * @method getInstanceCount
 */
/**
 * Retrieves the number of features per instance used to train the model.
 * @method getFeatureCount
 */
/**
 * Computes the gradient as well as evaluates the input using least squares.
 * @method compute
 * @param {number[]} input The vector to evaluate.
 * @param {number[]} gradient The derivative or gradient.
 * @returns {number} The calculated loss.
 */
var LeastSquares = function (options) {
    var state = {};
    if (typeof options !== 'object') {
        throw new TypeError('Invalid options type: expected an object');
    }

    var l2WeightType = typeof options.l2Weight;
    if (l2WeightType === 'undefined') {
        state.l2Weight = 0.0;
    } else if (l2WeightType !== 'number') {
        throw new TypeError('Invalid l2Weight type: expected a number');
    } else {
        state.l2Weight = options.l2Weight;
    }

    validate.featuresAndLabels(options);
    state.features = options.features;
    state.labels = options.labels;
    state.m = options.features.length;
    state.n = options.features[0].length;

    this.getInstanceCount = function () {
        return state.m;
    };

    this.getFeatureCount = function () {
        return state.n;
    };

    this.compute = function (input, gradient) {
        debug('> compute');
        if (input.length !== state.n) {
            throw new Error('Invalid input length: expected to match feature count');
        }

        var labels = numeric.mul(state.labels, -1.0);
        var value = 0.0;
        for (var index2 = 0; index2 < state.n; index2++) {
            value += input[index2] * input[index2] * state.l2Weight;
            gradient[index2] = state.l2Weight * input[index2];
            for (var index1 = 0; index1 < state.m; index1++) {
                labels[index1] += input[index2] * state.features[index1][index2];
            }
        }

        for (var index1 = 0; index1 < state.m; index1++) {
            if (labels[index1] !== 0.0) {
                value += labels[index1] * labels[index1];
                for (var index2 = 0; index2 < state.n; index2++) {
                    gradient[index2] += state.features[index1][index2] * labels[index1];
                }
            }
        }

        debug('< compute');
        return 0.5 * value + 1.0;
    };
};

module.exports = LeastSquares;
