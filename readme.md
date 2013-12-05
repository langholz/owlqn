# owlqn
**Author:** Elmar Langholz

`owlqn` or Orthant-Wise Limited-memory Quasi-Newton is a minimizer used for training machine learning models. It minimizes functions of the form `f(w) = loss(w) + C |w|_1`, where `loss` is an arbitrary differentiable convex loss function, and `|w|_1` is the L1 norm of the weight (parameter) vector. It is based on the [LBFGS](http://en.wikipedia.org/wiki/L-BFGS)  Quasi-Newton algorithm, with modifications to deal with the fact that the L1 norm is not differentiable. It was developed and published by Galen Andrew and Jianfeng Gao on [Scalable training of L1-regularized log-linear models](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.72.2173).

Two examples of machine learning models used are the following:
* L1-regularized least squares models, where OWL-QN finds weights `w` that minimize: `sum_i 0.5 |<w, x_i> - y_i|^2_2 + C |w|_1`
* L1-regularized logistic regression models, where OWL-QN finds weights `w` that minimize: `sum_i log_loss(w | x_i, y_i) + C |w|_1`

## Installation

```
npm install owlqn
```

## Usage

```js
// Include dependencies
var OWLQN = require('owlqn').OWLQN;
var LogisticRegression = require('owlqn').LogisticRegression;

// Declare logistic regression problem
var logisticRegressionOptions = {
    features: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
    labels: [-1, -1, -1, -1, 1, -1, 1, -1, 1, 1],
    l2Weight: 0.0
};
var logisticRegression = new LogisticRegression(logisticRegressionOptions);

// Define owl-qn optimizer and minimize
var owlqn = new OWQLN();
var minimizeOptions = {
    differentiableFunction: logisticRegression,
    initializationVector: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    l1Weight: 0.1,
    memoryParameter: 10,
    convergenceTolerance: 1e-4;
};
var result = owlqn.minimize(minimizeOptions);
```

## Documentation
* [OWLQN](./doc/api/owlqn.md)
* [LeastSquares](./doc/api/leastSquares.md)
* [LogisticRegression](./doc/api/logisticRegression.md)

## Examples
* [LeastSquares](./examples/leastSquares.js)
* [LogisticRegression](./examples/logisticRegression.js)
