WebFilings Grunt
================

> Opinionated Suite of Common Grunt Tasks for JavaScript Libraries.

- [Consuming This Library](#consuming-this-library)
- [Advanced Configuration](#advanced-configuration)
- [Task Reference](#task-reference)
- [Credits](#credits)


Consuming This Library
----------------------

#### Expectations

This is an opinionated solution, and expects the following project structure:

- `docs/` project design and API documentation
- `examples/` sample applications and such
- `out/` output from build tasks
- `src/` source files
- `test/` test files
- `tools/` supporting tools for code quality, builds, etc.
- `index.html` the default web page for the project

If you want to meet these expectations simply, use the
[Yeoman generator for wf-js projects](https://github.com/WebFilings/generator-wf-js):

#### Installation

```bash
# init npm for your project if you haven't already:
$ npm init

# install wf-grunt
$ npm install --save-dev git+ssh://git@github.com:WebFilings/wf-grunt.git#{version}
```

#### Basic Configuration

```javascript
// In Gruntfile.js
module.exports = function(grunt) {
    require('wf-grunt').init(grunt);
};
```

Yes, it's that easy to configure!


Advanced Configuration
----------------------

This project tries to use sensible defaults, but chances are good you'll want to:

- modify the default settings for wf-grunt;
- modify or extend the default configuration for the plugins wf-grunt uses; or,
- extend the grunt configuration to work with project-specific plugins and tasks.

#### Modify the Default Settings for wf-grunt

Modification of the settings for wf-grunt is done through the `options` property
of the `config` parameter passed into `wfGrunt.init(grunt, config)`.

```javascript
// Example using all the available options:
module.exports = function(grunt) {
    require('wf-grunt').init(grunt, {
        options: {

            // Setup a RequireJS config template to use with Jasmine and Karma.
            // All paths should be based on the project root.
            // DEFAULT: undefined
            requireConfig: {
                paths: {
                    file: 'path/to/file.js',
                    alias: 'path/to/directory',
                    'your-project-name': './src'
                },
                shim: {
                    // As you need....
                }
            },

            // Set code coverage thresholds. Disable by setting to null.
            // If coverage dips below these values, the relevant tasks will fail.
            // DEFAULT: 90% across the board.
            coverageThresholds: {
                statements: 90,
                branches: 90,
                functions: 90,
                lines: 90
            },

            // Change the default port used by the provided Connect web server.
            // DEFAULT: 9000
            wwwPort: 9000,

            // Forward HTTP requests made to the provided Connect web server.
            // DEFAULT: undefined
            proxies: {
                // Can forward to another host.
                '/requested/path': 'http://host:port/forwarded/path',
                // Can forward/redirect to same host.
                '/requested/path': '/forwarded/path',
                // Can use regex pattern matching and replacements.
                '/requested/path/(.*\\.html)': '/forwarded/path/$1',
            },

            // Enable Karma testing with BrowserStack by supplying your credentials.
            // If enabled, you will have a default set of browsers available for
            // executing your unit tests via the following task:targets:
            // - iOS      karma:ios
            // - OS X     karma:osx
            // - Windows  karma:win
            // DEFAULT: undefined
            browserStackCredentials: {
                username: 'your_username',
                accessKey: 'your_accessKey'
            },

            // Modify the list of subtasks run when a built-in alias task is run.
            // This is handy for adding custom tasks from outside of wf-grunt
            // into the various workflow tasks provided.
            onAliasTaskRunning: function(name, tasks) {
                if (name === 'lint') {
                    tasks.unshift('customTask');
                }
            }
        }
    });
};
```

#### Modify or Extend the Default Configuration for the Plugins wf-grunt Uses

wf-grunt uses many common and popular plugins -- such as `grunt-contrib-watch`
and `grunt-contrib-jshint` -- and configures these plugins to suit its needs.
If you have to make use of these plugins in additional ways, it is simple to merge
custom configuration settings into the configuration built up by wf-grunt.

```javascript
// Example of merging custom settings for plugins used by wf-grunt.
module.exports = function(grunt) {
    require('wf-grunt').init(grunt, {

        // Add a configuration property for the plugin you want to modify or extend.
        // The values are merged into the configuration built up by wf-grunt.
        jshint: {

            // MODIFICATION:
            // Add a global var to the hinting rules for the files in src/.
            // wf-grunt has already specified a src target and configured it,
            // so you can just tweak those settings to suit your need.
            src: {
                options: {
                    globals: {
                        foo: true
                    }
                }
            },

            // EXTENSION:
            // Add a custom jshint target, available via: `grunt jshint:custom`.
            custom: {
                src: ['some/glob/**/*.js'],
                options: {
                    browser: true
                }
            }
         }
    });
};
```

#### Extend the Grunt Configuration for Project-Specific Plugins and Tasks

Another common scenario is that you want to configure plugins and tasks that live
outside of wf-grunt. As described above, since configuration properties are
merged over the configuration generated by wf-grunt, this is easy:

```javascript
// Example of specifying configuration for project-specific plugins and tasks.
module.exports = function(grunt) {
    require('wf-grunt').init(grunt, {
        adhoc: {
            // ...
        }
    });

    grunt.loadNpmTasks('grunt-adhoc');
};
```


Task Reference
--------------

To see a list of the tasks available:

```bash
$ grunt -h
```

#### Workflow Tasks

The following tasks will combine a number of single tasks in a meaningful way.

```
$ grunt          Check code quality (lint, test, cover, docs).
$ grunt qa       Check code quality and open the project web site.
$ grunt serve    Open the project web site.
$ grunt dev      Lint and test, open the project web site and watch.
$ grunt lint     Lint files and watch.
$ grunt test     Run tests, open the spec runner and watch.
$ grunt cover    Run code coverage, open the coverage report and watch.
$ grunt analyze  Run complexity analysis, open the report and watch.
$ grunt docs     Generate API docs, open the index and watch.
```

Most of the tasks above start a watch after first executing. If the task is failing
out of the gate, you can force it to continue into a watch state by appending
the `--force` flag to the end of your command like so:

```
# this task fails cause there's a broken test,
# but you wanted to launch the HTML spec runner and start a watch :(
$ grunt test

# just force the task to continue past the failure
$ grunt test --force
```

#### Watches

The tasks that start a watch will, on changes to relevant source files,
refresh both the console output and HTML pages served from the site.
The intent is to eliminate context switching between your editor
and your feedback mechanism of choice.

If you want to start a watch even when tasks are failing, start the watch first:

```
$ grunt watch:dev
$ grunt watch:lint
$ grunt watch:test
$ grunt watch:cover
$ grunt watch:docs
```

#### Node Server

This project uses a [Connect][Connect] web server to serve files from the project.

```
$ grunt connect:run    Start the project's web server and kill after task finishes.
$ grunt connect:serve  Start the project's web server and keep it alive.
```

#### Linting

```
$ grunt jshint           Validate all files with JSHint.
$ grunt jshint:examples  Validate example files.
$ grunt jshint:node      Validate node files.
$ grunt jshint:src       Validate source files.
$ grunt jshint:test      Validate test files.
```

#### Static Analysis

```
$ grunt plato  Run code complexity analysis using Plato.
```

#### Testing & Code Coverage

```
$ grunt jasmine           Run jasmine specs and istanbul code coverage headlessly.
$ grunt jasmine:coverage  Run istanbul code coverage.
$ grunt jasmine:test      Run jasmine specs.
```

#### Cross-Browser Testing

We use [Karma][Karma] and [BrowserStack][BrowserStack] to do cross-browser testing.

```
$ grunt karma:dev  Start karma and wait for locally connected clients.
$ grunt karma:ios  Start karma and launch iOS devices on BrowserStack.
$ grunt karma:osx  Start karma and launch OS X browsers on BrowserStack.
$ grunt karma:win  Start karma and launch Windows browsers on BrowserStack.
```

The `:dev` target is useful for fixing test failures from BrowserStack browsers.
It will start Karma, run tests on PhantomJS for a quick sanity check, and then wait.
You can then connect devices to the Karma server and start fixing things.
Just point your browsers to the URL Karma logs after it is started.

#### API Documentation

```
$ grunt jsdoc  Generate source documentation using jsdoc.
```

#### Shell Commands

```
$ grunt shell                       Run shell commands.
$ grunt shell:installPreCommitHook  Install git pre commit hook for code quality.
$ grunt shell:installPrePushHook    Install git pre push hook for code quality.
$ grunt shell:openCoverage          Open the istanbul code coverage report.
$ grunt shell:openDocs              Open the API docs.
$ grunt shell:openTest              Open the jasmine spec runner.
$ grunt shell:openWeb               Open the project's web site.
```

#### Cleaning Up

```
$ grunt clean           Clean all output files and folders.
$ grunt clean:coverage  Clean code coverage output.
$ grunt clean:docs      Clean generated API documentation.
$ grunt clean:test      Clean test output.
```

#### Git Hooks

```
$ grunt precommit  Run lint and test tasks.
$ grunt prepush    Run lint, test, cover and docs tasks.
```


Credits
-------

- [Node][Node]: server-side JavaScript
- [NPM][NPM]: package manager for server-side JavaScript
- [Grunt][Grunt]: task runner
- [Connect][Connect]: local dev server
- [RequireJs][RequireJs]: module loader
- [JSDoc][JSDoc]: API documentation generator
- [JSHint][JSHint]: JavaScript source file validator
- [Plato][Plato]: JavaScript code visualization, static analysis, and complexity
- [Jasmine][Jasmine]: test framework
- [Istanbul][Istanbul]: code coverage framework
- [Karma][Karma]: multi-client test runner
- [BrowserStack][BrowserStack]: browsers in the cloud

[Node]: http://nodejs.org/api/
[NPM]: https://npmjs.org/
[Grunt]: http://gruntjs.com/
[Connect]: http://www.senchalabs.org/connect/
[RequireJs]: http://requirejs.org/
[JSDoc]: http://usejsdoc.org/
[JSHint]: http://www.jshint.com/docs/
[Plato]: https://github.com/es-analysis/plato
[Jasmine]: http://pivotal.github.io/jasmine/
[Istanbul]: https://github.com/gotwarlost/istanbul
[Karma]: http://karma-runner.github.io/
[BrowserStack]: http://www.browserstack.com/list-of-browsers-and-platforms

[DefaultJSHintConfiguration]: https://github.com/WebFilings/wf-grunt/blob/master/src/config/jshint.js
