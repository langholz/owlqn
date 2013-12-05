var debug = require('debug')('owlqn::terminationCriterion');
var defaultNumberOfIterationsToAverage = 5;
var defaultMaximumNumberOfOptimizerValues = 10;

var TerminationCriterion = function (options) {
    var state = { previousOptimizerValues: [] };
    var optionsType = typeof options;
    if (optionsType === 'undefined') {
        state.numberOfIterationsToAverage = defaultNumberOfIterationsToAverage;
        state.maximumOptimizerValues = defaultMaximumNumberOfOptimizerValues;
    } else if (optionsType !== 'object') {
        throw new TypeError('Invalid options type');
    } else {
        // Validate the number of iterations to average
        var numberOfIterationsToAverageType = typeof options.numberOfIterationsToAverage;
        if (numberOfIterationsToAverageType === 'undefined') {
            state.numberOfIterationsToAverage = defaultNumberOfIterationsToAverage;
        } else if (numberOfIterationsToAverageType !== 'number') {
            throw new TypeError('Invalid numberOfIterationsToAverage type: expected a number');
        } else if (state.numberOfIterationsToAverage <= 0) {
            throw new Error('Invalid numberOfIterationsToAverage value: expected it to be larger or equal to one');
        }

        // Validate the maximum optimizer values
        var maximumOptimizerValuesType = typeof options.maximumOptimizerValues;
        if (maximumOptimizerValuesType === 'undefined') {
            options.maximumOptimizerValues = defaultMaximumNumberOfOptimizerValues;
        } else if (maximumOptimizerValuesType !== 'number') {
            throw new TypeError('Invalid maximumOptimizerValues type: expected a number');
        } else if (options.maximumOptimizerValues <= 0) {
            throw new Error('Invalid maximumOptimizerValues value: expected it to be larger or equal to one');
        }
    }

    this.getValue = function (optimizer) {
        return getRelativeMeanImprovement(state, optimizer);
    };
};

function getRelativeMeanImprovement(state, optimizer) {
    debug('> getRelativeMeanImprovement');
    var value = Number.POSITIVE_INFINITY;
    var optimizerStateValue = optimizer.getValue();
    if (state.previousOptimizerValues.length > state.numberOfIterationsToAverage) {
        var previousOptimizerValue = state.previousOptimizerValues[0];
        if (state.previousOptimizerValues.length === state.maximumOptimizerValues) {
            state.previousOptimizerValues.shift();
        }

        var averageImprovement = (previousOptimizerValue - optimizerStateValue) / state.previousOptimizerValues.length;
        var relativeAverageImprovement = averageImprovement / Math.abs(optimizerStateValue);
        value = relativeAverageImprovement;
        debug('Relative average improvement: ' + relativeAverageImprovement);
    } else {
        debug(
            'Waiting for ' + state.numberOfIterationsToAverage + ' in order ' +
            'to determine whether or not we are able to terminate');
    }

    state.previousOptimizerValues.push(optimizerStateValue);
    debug('< getRelativeMeanImprovement');
    return value;
}

module.exports = TerminationCriterion;
