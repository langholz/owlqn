LeastSquares API
================
**Author:** Elmar Langholz

LeastSquares(options)
---------------------
Initializes a new instance of the `LeastSquares`.


**Parameters**

**options**:  *LeastSquaresOptions*,  The options to initialize the least squares problem with.

class LeastSquaresOptions
-------------------------
**Members**

**features**:  *number[number[]]*,  The feature matrix to process.

**labels**:  *number[]*,  The corresponding labels for the provided features.

**[l2Weight]**:  *number*,  The L2 weight to use for the least squares problem. If not provided, 0.0 is used.

class LeastSquares
------------------
**Methods**

LeastSquares.getInstanceCount()
-------------------------------
Retrieves the number of feature instances used to train the model.


LeastSquares.getFeatureCount()
------------------------------
Retrieves the number of features per instance used to train the model.


LeastSquares.compute(input, gradient)
-------------------------------------
Computes the gradient as well as evaluates the input using least squares.


**Parameters**

**input**:  *number[]*,  The vector to evaluate.

**gradient**:  *number[]*,  The derivative or gradient.

**Returns**

*number*,  The calculated loss.

