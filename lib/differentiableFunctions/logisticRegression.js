/**
 * @title LogisticRegression API
 * @author Elmar Langholz
 */

var debug = require('debug')('logisticRegression');
var numeric = require('numeric');
var validate = require('./validate');

/**
 * Create a LogisticRegressionOptions object
 * @class LogisticRegressionOptions
 * @member {number[number[]]} features The feature matrix to process.
 * @member {number[]} labels The corresponding labels for the provided features. These should be either -1 or 1.
 * @member {number} [l2Weight] The L2 weight to use for the logistic regression problem. If not provided, 0.0 is used.
 */

/**
 * Create a LogisticRegression object
 * @class LogisticRegression
 */
/**
 * Initializes a new instance of the `LogisticRegression`.
 * @function LogisticRegression
 * @param {LogisticRegressionOptions} options The options to initialize the logistic regression problem with.
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
 * Computes the gradient as well as evaluates the input using logistic regression.
 * @method compute
 * @param {number[]} input The vector to evaluate.
 * @param {number[]} gradient The derivative or gradient.
 * @returns {number} The calculated loss.
 */
var LogisticRegression = function (options) {
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
    for (var index = 0; index < options.labels.length; index++) {
        if (options.labels[index] !== 1 && options.labels[index] !== -1) {
            throw new Error('Invalid label value at index ' + index + ': expected value to be minus one or one');
        }
    }

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

        var loss = 1.0;
        for (var index = 0; index < input.length; index++) {
            loss += 0.5 * input[index] * input[index] * state.l2Weight;
            gradient[index] = state.l2Weight * input[index];
        }

        for (var index = 0; index < state.m; index++) {
            var score = numeric.dot(state.features[index], input) * state.labels[index];
            var instanceLoss = 0.0;
            var instanceProbability = 0.0;
            if (score < -30.0) {
                instanceLoss = -score;
                instanceProbability = 0.0;
            } else if (score > 30.0) {
                instanceLoss = 0.0;
                instanceProbability = 1.0;
            } else {
                var logisticFunctionDenominator = 1.0 + Math.exp(-score);
                instanceLoss = Math.log(logisticFunctionDenominator);
                instanceProbability = 1.0 / logisticFunctionDenominator;
            }

            loss += instanceLoss;
            numeric.addeq(
                gradient,
                numeric.mul(state.features[index], state.labels[index], (1.0 - instanceProbability) * -1.0));
        }

        debug('< compute');
        return loss;
    };
};

module.exports = LogisticRegression;
