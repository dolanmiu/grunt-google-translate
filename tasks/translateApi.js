/*jslint nomen: true */
/*globals module, require */
var _ = require('lodash');
var Q = require('q');

function deepTraverseJson(json, lambda) {
    'use strict';

    _.forOwn(json, function (value, key) {
        if (_.isObject(value)) {
            deepTraverseJson(value, lambda);
            return;
        }
        lambda(json, value, key);
    });
}

module.exports = function (grunt, sourceJson) {
    'use strict';

    var deferred = Q.defer();

    deepTraverseJson(sourceJson, function (parent, value, key) {
        parent[key] = 'hi';
        //grunt.log.writeln(parent[key]);
    });
    
    grunt.log.writeln(JSON.stringify(sourceJson));
};