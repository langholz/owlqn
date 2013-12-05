LogisticRegression API
======================
**Author:** Elmar Langholz

LogisticRegression(options)
---------------------------
Initializes a new instance of the `LogisticRegression`.


**Parameters**

**options**:  *LogisticRegressionOptions*,  The options to initialize the logistic regression problem with.

class LogisticRegressionOptions
-------------------------------
**Members**

**features**:  *number[number[]]*,  The feature matrix to process.

**labels**:  *number[]*,  The corresponding labels for the provided features. These should be either -1 or 1.

**[l2Weight]**:  *number*,  The L2 weight to use for the logistic regression problem. If not provided, 0.0 is used.

class LogisticRegression
------------------------
**Methods**

LogisticRegression.getInstanceCount()
-------------------------------------
Retrieves the number of feature instances used to train the model.


LogisticRegression.getFeatureCount()
------------------------------------
Retrieves the number of features per instance used to train the model.


LogisticRegression.compute(input, gradient)
-------------------------------------------
Computes the gradient as well as evaluates the input using logistic regression.


**Parameters**

**input**:  *number[]*,  The vector to evaluate.

**gradient**:  *number[]*,  The derivative or gradient.

**Returns**

*number*,  The calculated loss.

