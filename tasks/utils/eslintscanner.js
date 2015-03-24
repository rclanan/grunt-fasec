'use strict';

var chalk = require('chalk');
var eslint = require('eslint');

// https://github.com/eslint/eslint/blob/5322a4ab9757eb745030ddcafa076ab5b4317e50/lib/cli.js#L129
function getErrorResults(results) {
  var filtered = [];

  results.forEach(function(result) {
    var filteredMessages = result.messages.filter(function(message) {
      return message.severity === 2;
    });

    if (filteredMessages.length > 0) {
      filtered.push({
        filePath: result.filePath,
        messages: filteredMessages
      });
    }
  });

  return filtered;
}

function eslintScanner(grunt) {
  var opts = grunt.options({
    configFile: 'configs/eslint.yml',
    outputFile: false,
    quiet: true
  });

  if (grunt.filesSrc.length === 0) {
    grunt.log.writeln(chalk.magenta(
      'Could not find any files to validate.'));
    return;
  }

  var engine = new eslint.CLIEngine(opts);
  var report = engine.executeOnFiles(grunt.filesSrc);
  var results = report.results;

  if (opts.quiet) {
    results = getErrorResults(results);
  }

  var formatter = engine.getFormatter(opts.format);

  if (!formatter) {
    grunt.warn('Could not find formatter ' + opts.format + '\'.');
    return;
  }

  var output = formatter(results);

  if (opts.outputFile) {
    grunt.file.write(opts.outputFile, output);
  } else {
    console.log(output);
  }

  return (report.errorCount === 0);
}

module.exports = eslintScanner;
