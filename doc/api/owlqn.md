OWLQN API
=========
**Author:** Elmar Langholz

OWLQN(options)
--------------
Initializes a new instance of the `OWLQN`.


**Parameters**

**options**:  *OWLQNOptions*,  The options to initialize the OWL-QN minimizer with.

class TerminationCriterion
--------------------------
**Members**

**getValue**:  *function*,  Determines the actual state of the criteria.

class OWLQNOptions
------------------
**Members**

**terminationCriterion**:  *TerminationCriterion*,  The termination criterion class used to determine if we have reached completion.

class DifferentiableFunction
----------------------------
**Members**

**compute**:  *function*,  The function that computes the loss and derivative.

class MinimizerOptions
----------------------
**Members**

**differentiableFunction**:  *DifferentiableFunction*,  The function used to minimize the problem.

**initializationVector**:  *number[]*,  The initialization vector to use.

**l1Weight**:  *number*,  The L1 regularization weight.

**[memoryParameter]**:  *number*,  The L-BFGS memory parameter. The default is 10.

**[maximumIterations]**:  *number*,  The maximum number of iterations to try before exiting. The default is Number.MAX_VALUE.

**[convergenceTolerance]**:  *number*,  The convergence tolerance. The default value is 1e-4.

class OWLQN
-----------
**Methods**

OWLQN.minimize(options)
-----------------------
Minimizes a problem based on the provided parameters.


**Parameters**

**options**:  *MinimizerOptions*,  The minimizer options.

**Returns**

*number[]*,  The minimized result.

