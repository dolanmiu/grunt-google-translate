# grunt-google-translate

> A build task to translate JSON files to other languages using Google's Translation API. Pairs very well with angular-translate.

Massive thanks to [MartyIce](https://github.com/MartyIce) for allowing me to use the grunt-google-translate namespace.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-google-translate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-google-translate');
```

## The "google_translate" task

### Overview
In your project's Gruntfile, add a section named `google_translate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  google_translate: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.googleApiKey
Type: `String`
Default value: `',  '`

The API key used to access Google Translation services.

### Usage Examples

#### Simple Example
In this example, I passed in a JSON file with english text. It will then create two files in the ```i18n/``` folder called ru.json and zh-CN.json for Russian and Chinese respectively.

Note: This plugin will try and deduce the suffix (file type), so you don't need to explicity specify it. If you need it to have a different suffix, then specify the ```suffix``` as shown in the next example.

```js
grunt.initConfig({
    google_translate: {
        default_options: {
            options: {
                googleApiKey: YOUR_API_KEY_HERE
            },
            files: [{
                src: '<%= yeoman.client %>/i18n/en.json',
                sourceLanguage: 'en',
                targetLanguages: ['ru', 'zh-CN'],
                dest: '<%= yeoman.client %>/i18n/'
            }]
        }
    }
});
```

#### Full Example
In this example, two files are being translated, one called ```locale-en.json``` and another called ```locale-fr.json```. They are in different folders, and will create translated files in the same ```i18n/``` folder.

Notice how the prefix and suffix is specified, it means the translated files will be named like ```locale-de.json``` instead of ```de.json```.

```js
grunt.initConfig({
    google_translate: {
        default_options: {
            options: {
                googleApiKey: YOUR_API_KEY_HERE
            },
            files: [{
                src: '<%= yeoman.client %>/i18n/locale-en.json',
                sourceLanguage: 'en',
                targetLanguages: ['ru', 'zh-CN'],
                dest: '<%= yeoman.client %>/i18n/',
                prefix: 'locale-',
                suffix: '.json'
            }, {
                src: '<%= yeoman.client %>/specialFolder/locale-fr.json',
                sourceLanguage: 'fr',
                targetLanguages: ['de', 'zh-CN'],
                dest: '<%= yeoman.client %>/i18n/',
                prefix: 'locale-',
                suffix: '.json'
            },]
        }
    }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
