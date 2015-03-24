/*
 * grunt-fasec
 * https://github.com/Ray/grunt-fasec
 *
 * Copyright (c) 2015 Ray Clanan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },
    // Configuration to be run (and then tested).
    fasec: {
      default: {
        options: {},
        files: {
          'tmp/default': ['**/*.js']
        }
      },
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'fasec']);

  // By default, securtiy scanner and run all tests.
  grunt.registerTask('default', ['fasec']);

};
