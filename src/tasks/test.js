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

var subtasks = require('../util').getAliasTaskSubtasks;

module.exports = function(grunt) {
    grunt.registerTask('test', 'Run tests, open the HTML runner and watch.', function() {
        grunt.task.run(subtasks(this.name, [
            'connect:run',
            'clean:test',
            'jasmine:test',
            'shell:openTest',
            'watch:test'
        ]));
    });
};