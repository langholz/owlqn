var array = require('../lib/array');
var OWQLN = require('../lib/owlqn');
var LeastSquares = require('../lib/differentiableFunctions/leastSquares');

var features = [[1.2], [2.3], [3.0], [3.8], [4.7], [5.9]];
var labels = [1.1, 2.1, 3.1, 4.0, 4.9, 5.9];
var l1Weight = 0.1;
var l2Weight = 0.0;
var convergenceTolerance = 1e-4;
var memoryParameter = 10;
var leastSquaresOptions = {
    features: features,
    labels: labels,
    l2Weight: l2Weight
};
var leastSquares = new LeastSquares(leastSquaresOptions);
var owlqn = new OWQLN();
var initializationVector = array.create(leastSquares.getFeatureCount(), 0.0);
var minimizeOptions = {
    differentiableFunction: leastSquares,
    initializationVector: initializationVector,
    l1Weight: l1Weight,
    memoryParameter: memoryParameter,
    convergenceTolerance: convergenceTolerance
};
var result = owlqn.minimize(minimizeOptions);

var nonZero = 0;
for (var index = 0; index < result.length; index++) {
    if (result[index] !== 0.0) {
        nonZero++;
    }
}

console.log(nonZero + '/' + leastSquares.getFeatureCount() + ' non-zero weights');

for (var index = 0; index < result.length; index++) {
    console.log('[' + index + '] ' + result[index]);
}
