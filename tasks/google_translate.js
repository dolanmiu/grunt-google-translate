/*
 * grunt-google-translate
 * https://github.com/dolanmiu/grunt-google-translate
 *
 * Copyright (c) 2015 Dolan Miu
 * Licensed under the MIT license.
 */

/*jslint nomen: true, regexp: true*/
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

function translate(origJson, googleTranslate, source, target, destPath) {
    'use strict';

    var deferred = Q.defer(),
        jsonReferenceArray = [],
        sourceJson = _.cloneDeep(origJson);

    deepTraverseJson(sourceJson, function (parent, value, key) {
        jsonReferenceArray.push({
            parent: parent,
            value: value,
            key: key
        });
    });

    googleTranslate.translate(_.map(jsonReferenceArray, 'value'), source, target, function (err, translations) {
        var i;
        for (i = 0; i < jsonReferenceArray.length; i += 1) {
            jsonReferenceArray[i].parent[jsonReferenceArray[i].key] = translations[i].translatedText;
        }
        deferred.resolve({
            dest: destPath,
            json: sourceJson
        });
    });

    return deferred.promise;
}


module.exports = function (grunt) {
    'use strict';

    var promises = [];

    grunt.registerMultiTask('google_translate', 'A build task to translate JSON files to other languages using Google\'s Translation API. Pairs very well with angular-translate.', function () {
        var done = this.async(),
            defer = Q.defer(),
            googleTranslate = require('google-translate')(this.options().googleApiKey);


        this.files.forEach(function (file) {
            file.prefix = file.prefix || '';
            file.suffix = file.suffix || /.+(\..+)/.exec(file.src)[1];

            var languageJson = JSON.parse(grunt.file.read(file.src));

            file.targetLanguages.forEach(function (targetLanguage) {
                var filePath = file.dest + file.prefix + targetLanguage + file.suffix;
                promises.push(translate(languageJson, googleTranslate, file.sourceLanguage, targetLanguage, filePath));
            });
        });

        Q.all(promises).then(function (translatedJsons) {
            grunt.log.writeln('Writing translated file');
            translatedJsons.forEach(function (translatedJson) {
                grunt.file.write(translatedJson.dest, JSON.stringify(translatedJson.json, null, "\t"));
                grunt.log.writeln('Wrote translated file: ' + translatedJson.dest);
            });
            done();
        });

    });

};