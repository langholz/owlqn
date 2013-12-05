/**
 * @title OWLQN API
 * @author Elmar Langholz
 */

var debug = require('debug')('owlqn');
var TerminationCriterion = require('./terminationCriterion.js');
var Optimizer = require('./optimizer.js');
var defaultMaximumIterations = Number.MAX_VALUE;

function validateOptions(options) {
    if (typeof options !== 'object') {
        throw new TypeError('Invalid options type: expected an object');
    } else if (typeof options.terminationCriterion !== 'object') {
        throw new TypeError('Invalid terminationCriterion type: expected an object');
    } else if (typeof options.terminationCriterion.getValue !== 'function') {
        throw new TypeError('Invalid terminationCriterion.getValue type: expected a function');
    }
}

/**
 * Create a TerminationCriterion object
 * @class TerminationCriterion
 * @member {function} getValue Determines the actual state of the criteria.
 */
/**
 * Create a OWLQNOptions object
 * @class OWLQNOptions
 * @member {TerminationCriterion} terminationCriterion The termination criterion class used to determine if we have reached completion.
 */
/**
 * Create a DifferentiableFunction object
 * @class DifferentiableFunction
 * @member {function} compute The function that computes the loss and derivative.
 */
/**
 * Create a MinimizerOptions object
 * @class MinimizerOptions
 * @member {DifferentiableFunction} differentiableFunction The function used to minimize the problem.
 * @member {number[]} initializationVector The initialization vector to use.
 * @member {number} l1Weight The L1 regularization weight.
 * @member {number} [memoryParameter] The L-BFGS memory parameter. The default is 10.
 * @member {number} [maximumIterations] The maximum number of iterations to try before exiting. The default is Number.MAX_VALUE.
 * @member {number} [convergenceTolerance] The convergence tolerance. The default value is 1e-4.
 */

/**
 * Create a OWLQN object
 * @class OWLQN
 */
/**
 * Initializes a new instance of the `OWLQN`.
 * @function OWLQN
 * @param {OWLQNOptions} options The options to initialize the OWL-QN minimizer with.
 */
/**
 * Minimizes a problem based on the provided parameters.
 * @method minimize
 * @param {MinimizerOptions} options The minimizer options.
 * @returns {number[]} The minimized result.
 */
var OWLQN = function (options) {
    var state = {};
    if (typeof options === 'undefined') {
        state.terminationCriterion = new TerminationCriterion();
    } else {
        validateOptions(options);
        state.terminationCriterion = options.terminationCriterion;
    }

    this.minimize = function (options) {
        return minimize(state, options);
    };
};

function validateMinimizeOptions(options) {
    if (typeof options !== 'object') {
        throw new TypeError('Invalid minimize options type: expected an object');
    }
}

function continueLoop(options, optimizer, terminationCriterionValue) {
    return (optimizer.getIteration() < options.maximumIterations)
        && (terminationCriterionValue >= options.convergenceTolerance);
}

function minimize(state, options) {
    validateMinimizeOptions(options);

    var maximumIterationsType = typeof options.maximumIterations;
    if (maximumIterationsType === 'undefined') {
        options.maximumIterations = defaultMaximumIterations;
    } else if (maximumIterationsType !== 'number') {
        throw new TypeError('Invalid maximum iterations type: expected a number');
    }

    var convergenceToleranceType = typeof options.convergenceTolerance;
    if (convergenceToleranceType === 'undefined') {
        options.convergenceTolerance = 1e-4;
    } else if (convergenceToleranceType !== 'number') {
        throw new TypeError('Invalid convergence tolerance type: expected a number');
    }

    var optimizer = new Optimizer(options);
    debug(
        'Optimizing function of ' + options.initializationVector.length +
        ' variables with the following OWL-QN parameters:');
    debug('L1 Regularization Weight: ' + options.l1Weight);
    debug('Memory Parameter: ' + options.memoryParameter);
    debug('Convergence Tolerance: ' + options.convergenceTolerance);
    debug('Maximum iterations: ' + options.maximumIterations);
    debug('Iteration 0: ' + optimizer.getValue());

    var terminationCriterionValue = state.terminationCriterion.getValue(optimizer);
    while (continueLoop(options, optimizer, terminationCriterionValue)) {
        optimizer.optimize();
        terminationCriterionValue = state.terminationCriterion.getValue(optimizer);
        debug('Iteration ' + optimizer.getIteration() + ': ' + optimizer.getValue());

        if (!optimizer.xHashChanged()) {
            debug('x and xPrime are equal (no change since last iteration), meaning that we have converged');
            break;
        }

        if (continueLoop(options, optimizer, terminationCriterionValue)) {
            optimizer.shift();
        }
    }

    debug('Iteration rate: ' + optimizer.getIteration() + ' / ' + options.maximumIterations);
    debug('Convergence tolerance reached: ' + terminationCriterionValue >= options.convergenceTolerance);

    return optimizer.getMinimizedVector();
}

module.exports = OWLQN;
