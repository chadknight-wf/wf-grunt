/*
 * Copyright 2014 WebFilings, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var grunt = require('grunt');
var wfGrunt = require('../src/index');

describe('when wf-grunt initializes grunt context', function() {
    afterEach(function() {
        // Reset grunt context.
        grunt.task.init([], {});
    });

    describe('config', function() {

        it('should not have `options` property from wf-grunt config', function() {
            wfGrunt.init(grunt, {
                options: {
                    not: 'merged'
                }
            });

            expect(grunt.config('options')).toBeUndefined();
        });

        it('should have custom properties from wf-grunt config', function() {
            var customConfig = {
                property: 'merged'
            };

            wfGrunt.init(grunt, {
                custom: customConfig
            });

            expect(grunt.config('custom')).toEqual(customConfig);
        });

        [
            'clean',
            'connect',
            'jasmine',
            'jsdoc',
            'jshint',
            'karma',
            'plato',
            'shell',
            'watch'
        ].forEach(function(task) {
            it('should have `' + task + '` property', function() {
                wfGrunt.init(grunt);
                expect(grunt.config(task)).toBeDefined();
            });
        });
    });

    describe('tasks', function() {
        beforeEach(function() {
            wfGrunt.init(grunt);
        });

        [
            'default',
            'analyze',
            'cover',
            'default',
            'dev',
            'docs',
            'lint',
            'qa',
            'serve',
            'test'
        ].forEach(function(task) {
            it('should include `' + task + '` task', function() {
                wfGrunt.init(grunt);
                expect(grunt.task._tasks[task]).toBeDefined();
            });
        });
    });
});
