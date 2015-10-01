/*jslint nomen: true */
/*globals module, require */
var _ = require('lodash');
var Q = require('q');
var request = require('request');

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

function translate(apiKey, source, target, text) {
    'use strict';

    var deferred = Q.defer();
    request.post({
        url: 'https://www.googleapis.com/language/translate/v2',
        form: {
            key: apiKey,
            source: source,
            target: target,
            q: text
        },
        headers: {
            'X-HTTP-Method-Override': 'GET',
            'content-type': 'application/x-www-form-urlencoded'
        }
    }, function (err, response, body) {
        if (err) {
            return deferred.reject(err);
        }
        if (response.statusCode !== 200) {
            return deferred.reject(JSON.stringify(response));
        }
        return deferred.resolve(body);
    });

    return deferred.promise;
}

/*function convertArrayToGoogleTranslateQ(arr) {
    'use strict';

    var result = '';

    arr.forEach(function (text) {
        result += 'q=' + escape(text) + '&';
    });

    return result.slice(2, -1);
}*/

module.exports = function (grunt, sourceJson, googleTranslate, source, target) {
    'use strict';

    var deferred = Q.defer(),
        jsonReferenceArray = [];

    deepTraverseJson(sourceJson, function (parent, value, key) {
        jsonReferenceArray.push({
            parent: parent,
            value: value,
            key: key
        });
    });

    
    googleTranslate.translate(_.map(jsonReferenceArray, 'value'), 'en', 'de', function (err, translations) {
        grunt.log.writeln(JSON.stringify(translations));
        deferred.resolve(translations);
    });

    return deferred.promise;
};

/*module.exports = function (grunt, sourceJson, apiKey, source, target) {
    'use strict';

    var deferred = Q.defer(),
        jsonReferenceArray = [];

    deepTraverseJson(sourceJson, function (parent, value, key) {
        jsonReferenceArray.push({
            parent: parent,
            value: value,
            key: key
        });
    });

    var googleQString = convertArrayToGoogleTranslateQ(_.map(jsonReferenceArray, 'value'));
    translate(apiKey, source, target, googleQString).then(function (translations) {
        grunt.log.writeln(translations);

        //parent[key] = translations[0].translatedText;
        deferred.resolve();
    }, function (err) {
        grunt.log.error(err);
    });

    return deferred.promise;
};*/

/*module.exports = function (grunt, sourceJson, apiKey, source, target) {
    'use strict';

    var deferred = Q.defer(),
        promises = [];

    deepTraverseJson(sourceJson, function (parent, value, key) {
        parent[key] = 'hi';
        promises.push(function () {
            var deferred = Q.defer();

            translate(apiKey, source, target, escape(value)).then(function (translations) {
                grunt.log.writeln(translations);

                parent[key] = translations[0].translatedText;
                deferred.resolve();
            }, function (err) {
                grunt.log.error(err);
            }).catch(function (error) {
                grunt.log.writeln(error);
            });

            return deferred.promise;
        });
        //grunt.log.writeln(parent[key]);
    });

    Q.all(promises).then(function () {
        grunt.log.writeln(JSON.stringify(sourceJson));
        deferred.resolve();
    });
    var result = promises.reduce(function (prev, fn) {
        return prev.then(fn).delay(1000);
    }, Q());

    return deferred.promise;
};*/