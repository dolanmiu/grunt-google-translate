/*jslint nomen: true */
/*globals module, require */
var _ = require('lodash');

module.exports = function (grunt, sourceJson) {
    'use strict';
    
    var arrayOfArrays = [];
    
    /*_.each(sourceJson, function (item, key) {
        var itemVals = [];
        _.each(item, function (item2, key2) {
            itemVals.push(item2);
            grunt.log.writeln(item2);
        });
        arrayOfArrays.push(itemVals);
    });*/
    _.forOwn(sourceJson, function (value, key) {
        grunt.log.writeln(value); 
    });
    //console.log([]);
};