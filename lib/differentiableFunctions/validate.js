function validateFeatures(features) {
    if (!(features instanceof Array)) {
        throw new TypeError('Invalid features type: expected an array');
    }

    if (features.length < 1) {
        throw new Error('Invalid number of feature instances: expected at least one');
    }

    var featureCount = features[0].length;
    for (var index1 = 0; index1 < features.length; index1++) {
        if (features[index1].length < 1) {
            throw new Error('Invalid number of features: expected at least one');
        } else if (featureCount !== features[index1].length) {
            throw new Error(
                'Feature count mismatch: found two different counts - [0] ' + featureCount +
                    '[' + index1 + '] ' + features[index1].length);
        }

        for (var index2 = 0; index2 < features[index1].length; index2++) {
            if (typeof features[index1][index2] !== 'number') {
                throw new TypeError(
                    'Invalid feature value type: expected [' + index1 + '][' + index2 + '] ' +
                        'to be a number');
            }
        }
    }
}

function validateLabels(labels) {
    if (!(labels instanceof Array)) {
        throw new TypeError('Invalid labels type: expected an array');
    }

    if (labels.length < 1) {
        throw new Error('Invalid number of labels: expected at least one');
    }

    for (var index = 0; index < labels.length; index++) {
        if (typeof labels[index] !== 'number') {
            throw new TypeError('Invalid label type: expected [' + index + '] to be a number');
        }
    }
}

function validateFeaturesAndLabels(options) {
    validateFeatures(options.features);
    validateLabels(options.labels);

    if (options.features.length !== options.labels.length) {
        throw new Error(
            'Feature instances mismatch with labels count: feature instance count ' +
                options.features.length + ', labels count ' + options.labels.length);
    }
}

module.exports = {
    featuresAndLabels: validateFeaturesAndLabels
};
