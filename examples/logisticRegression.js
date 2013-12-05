var array = require('../lib/array');
var OWQLN = require('../lib/owlqn');
var LogisticRegression = require('../lib/differentiableFunctions/logisticRegression');

var features = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];
var labels = [-1, -1, -1, -1, 1, -1, 1, -1, 1, 1];
var l1Weight = 0.1;
var l2Weight = 0.0;
var convergenceTolerance = 1e-4;
var memoryParameter = 10;
var logisticRegressionOptions = {
    features: features,
    labels: labels,
    l2Weight: l2Weight
};
var logisticRegression = new LogisticRegression(logisticRegressionOptions);
var owlqn = new OWQLN();
var initializationVector = array.create(logisticRegression.getFeatureCount(), 0.0);
var minimizeOptions = {
    differentiableFunction: logisticRegression,
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

console.log(nonZero + '/' + logisticRegression.getFeatureCount() + ' non-zero weights');

for (var index = 0; index < result.length; index++) {
    console.log('[' + index + '] ' + result[index]);
}
