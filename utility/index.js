/*jslint node: true, nomen: true, regexp: true*/
'use strict';

var _ = require('lodash');

exports.deepTraverseJson = function (json, lambda) {
    _.forOwn(json, function (value, key) {
        if (_.isObject(value)) {
            exports.deepTraverseJson(value, lambda);
            return;
        }
        lambda(json, value, key);
    });
};