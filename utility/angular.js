/*jslint node: true, nomen: true, regexp: true*/
'use strict';

var _ = require('lodash');

var utility = require('./');

var variableDictionary = {};
var variableRegex = /(\{\{ ?\w+ ?\}\})/ig;
var replacedRegex = /(GRUNT_GOOGLE_TRANSLATE_VAR_\d+)/g;

function findVariables(str, regex) {
    var match = str.match(regex);

    if (match) {
        return match;
    } else {
        return [];
    }
}

function addToVariableDictionary(originalString) {
    var variables = findVariables(originalString, variableRegex),
        currentString = originalString;

    variables.forEach(function (variable) {
        var destinationVar = "GRUNT_GOOGLE_TRANSLATE_VAR_" + Object.keys(variableDictionary).length;

        variableDictionary[destinationVar] = variable;
        currentString = currentString.replace(variable, destinationVar);
    });

    return currentString;
}

exports.createVariableSafeJson = function (origJson) {
    var jsonReferenceArray = [],
        sourceJson = _.cloneDeep(origJson);

    utility.deepTraverseJson(sourceJson, function (parent, value, key) {
        var varSafeString = addToVariableDictionary(value);
        parent[key] = varSafeString;
    });

    return sourceJson;
};

exports.revertVariablesInJson = function (translatedJson) {
    var jsonReferenceArray = [],
        sourceJson = _.cloneDeep(translatedJson);

    utility.deepTraverseJson(sourceJson, function (parent, value, key) {
        var variables = findVariables(value, replacedRegex);
        
        variables.forEach(function (variable) {
            parent[key] = parent[key].replace(variable, variableDictionary[variable]);
        });
    });

    return sourceJson;
};

exports.variableDictionary = variableDictionary;