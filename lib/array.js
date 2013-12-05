var create = function (length, value) {
    if (typeof length !== 'number') {
        throw new TypeError('Invalid length type');
    }

    if (typeof value === 'undefined') {
        throw new Error('Invalid value: expected a value to be provided');
    }

    var array = new Array(length);
    for (var index = 0; index < length; index++) {
        array[index] = value;
    }

    return array;
};

var swap = function (array1, array2) {
    if (!(array1 instanceof Array)) {
        throw new TypeError('Invalid array1 type');
    }

    if (!(array2 instanceof Array)) {
        throw new TypeError('Invalid array2 type');
    }

    if (array1.length !== array2.length) {
        throw new Error('Array sizes do not match for swapping: ' + array1.length + ' !== ' + array2.length);
    }

    for (var index = 0; index < array1.length; index++) {
        var value = array1[index];
        array1[index] = array2[index];
        array2[index] = value;
    }
};

var areEqual = function (array1, array2) {
    if (!(array1 instanceof Array)) {
        throw new TypeError('Invalid array1 type');
    }

    if (!(array2 instanceof Array)) {
        throw new TypeError('Invalid array2 type');
    }

    var equal = array1.length === array2.length;
    if (equal) {
        for (var index = 0; index < array1.length; index++) {
            if (array1[index] !== array2[index]) {
                equal = false;
                break;
            }
        }
    }

    return equal;
};

var copy = function (toArray, fromArray) {
    if (!(toArray instanceof Array)) {
        throw new TypeError('Invalid array1 type');
    }

    if (!(fromArray instanceof Array)) {
        throw new TypeError('Invalid array2 type');
    }

    if (toArray.length !== fromArray.length) {
        throw new Error('Array sizes do not match for swapping: ' + toArray.length + ' !== ' + fromArray.length);
    }

    for (var index = 0; index < toArray.length; index++) {
        toArray[index] = fromArray[index];
    }
};

module.exports = {
    create: create,
    swap: swap,
    areEqual: areEqual,
    copy: copy
};
