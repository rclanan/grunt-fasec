'use strict';

var chalk = require('chalk');
var eslint = require('eslint');
var retire = require('retire/lib/retire');
var repo = require('retire/lib/repo');
var resolve = require('retire/lib/resolve');
var log = require('retire/lib/utils').log;
var scanner = require('retire/lib/scanner');
var fs = require('fs');
var path = require('path');
var req = require('request');
var os = require('os');
var async = require('async');

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

function esLintScanner(grunt) {
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

function retirejsScanner(grunt) {

}

var eslintScan = false;

module.exports = function(grunt) {

  grunt.registerMultiTask('fasec', 'Fusion Alliance Security Scanner',
    function() {
      // EsLint Scanner
      eslintScan = esLintScanner(this);

      // RetireJs Scanner - Clean this up
      var done = this.async();
      var jsRepo = null;
      var nodeRepo = null;
      var vulnsFound = false;
      var filesSrc = this.filesSrc;
      var request = req;
      var defaultIgnoreFile = '.retireignore';

      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        verbose: false,
        packageOnly: false,
        jsRepository: 'https://raw.github.com/RetireJS/retire.js/master/repository/jsrepository.json',
        nodeRepository: 'https://raw.github.com/RetireJS/retire.js/master/repository/npmrepository.json',
        logger: grunt.log.writeln,
        warnlogger: grunt.log.error
      });
      var logger = log(options);

      if (!options.nocache) {
        options.cachedir = path.resolve(os.tmpdir(), '.retire-cache/');
      }

      var ignores = options.ignore ? options.ignore.split(',') : [];

      options.ignore = [];

      if (!options.ignorefile && grunt.file.exists(defaultIgnoreFile)) {
        options.ignorefile = defaultIgnoreFile;
      }

      if (options.ignorefile) {
        if (!grunt.file.exists(options.ignorefile)) {
          grunt.log.error('Error: Could not read ignore file: ' + options.ignorefile);
          process.exit(1);
        }

        var lines = fs.readFileSync(options.ignorefile).toString().split(
          /\r\n|\n/g).filter(function(e) {
          return e !== '';
        });

        var ignored = lines.map(function(e) {
          return e[0] === '@' ? e.slice(1) : path.resolve(e);
        });

        options.ignore = options.ignore.concat(ignored);
      }

      ignores.forEach(function(e) {
        options.ignore.push(e);
      });

      logger.verbose("Ignoring " + JSON.stringify(options.ignore));

      // log (verbose) options before hooking in the reporter
      grunt.verbose.writeflags(options, 'Options');

      // required to throw proper grunt error
      scanner.on('vulnerable-dependency-found', function(e) {
        vulnsFound = true;
      });

      var events = [];

      function once(name, fun) {
        events.push(name);
        grunt.event.once(name, fun);
      }

      function on(name, fun) {
        events.push(name);
        grunt.event.on(name, fun);
      }

      once('retire-js-repo', function() {
        filesSrc.forEach(function(filepath) {
          if (!grunt.file.exists(filepath)) {
            grunt.log.debug('Skipping directory file:', filepath);

            return;
          }

          if (!grunt.file.isFile(filepath)) {
            grunt.log.debug('Not a file:', filepath);

            return;
          }

          if (options.verbose) {
            grunt.log.writeln('Checking:', filepath);
          }

          if (filepath.match(/\.js$/)) {
            scanner.scanJsFile(filepath, jsRepo, options);
          } else if (filepath.match(/\/bower.json$/)) {
            scanner.scanBowerFile(filepath, jsRepo, options);
          } else {
            grunt.log.debug('Unknown file type:', filepath);
          }
        });

        grunt.event.emit('retire-done');
      });

      on('retire-node-scan', function(filesSrc) {
        if (filesSrc.length === 0) {
          grunt.event.emit('retire-done');
          return;
        }

        var filepath = filesSrc[0];

        if (grunt.file.exists(filepath + '/package.json')) {
          if (options.verbose) {
            grunt.log.writeln('Checking:', filepath);
          }

          resolve.getNodeDependencies(filepath, options.packageOnly).on(
            'done',
            function(dependencies) {
              scanner.scanDependencies(dependencies, nodeRepo,
                options);
              grunt.event.emit('retire-node-scan', filesSrc.slice(1));
            });
        } else {
          grunt.log.debug('Skipping. Could not find:', filepath +
            '/package.json');
          grunt.event.emit('retire-node-scan', filesSrc.slice(1));
        }
      });

      once('retire-load-js', function() {
        repo.loadrepository(options.jsRepository, options).on('done',
          function(repo) {
            jsRepo = repo;
            grunt.event.emit('retire-js-repo');
          });
      });

      once('retire-load-node', function() {
        repo.loadrepository(options.nodeRepository, options).on('done',
          function(repo) {
            nodeRepo = repo;
            grunt.event.emit('retire-node-scan', filesSrc);
          });
      });

      once('retire-done', function() {
        if (!vulnsFound) {
          grunt.log.writeln("No vulnerabilities found.");
        }

        events.forEach(function(e) {
          grunt.event.removeAllListeners(e);
        });

        if(!vulnsFound && eslintScan) {
          grunt.log.writeln(chalk.green("Fusion Alliance Security Scanner Complete. All Scans Passed"));

        } else {
          grunt.log.error("Fusion Alliance Security Scanner Complete. Errors Found. Please review previous messages");
        }

        done(!vulnsFound && eslintScan);
      });

      grunt.event.emit(this.target === 'node' ? 'retire-load-node' :
        'retire-load-js');
    });
};
