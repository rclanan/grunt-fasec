# Fusion Alliance Security for Node.js - Grunt Plugin

Grunt task to configure and execute [FASEC ESLint plugins](https://github.com/fusionalliance/eslint-plugin-fasec)


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fasec --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fasec');
```


## The "fasec" task

### Overview
In your project's Gruntfile, add a section named `fasec` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  fasec: {
    default: {
      options: {
        // Task-specific options go here.
      },
      files: {
        // Target-specific file lists and/or options go here.
      }
    },
  }
});
```


### Demo
To see FASEC in action, clone and run the [FASEC demo project](https://github.com/fusionalliance/fasec-demo).


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Contributors

[![Fusion Alliance Logo](https://avatars0.githubusercontent.com/u/1154219?v=3&u=e1451e6a65343331369d53a2b6e0c7046c2cc810&s=60)](https://github.com/FusionAlliance)
**FASEC Grunt plugin** is a product of Fusion Alliance &copy; 2015.

+ [Ray Clannan](https://github.com/rclanan) (Author)


## LICENSE

The MIT License (MIT)

Copyright (c) 2015 [Fusion Alliance](https://www.fusionalliance.com/?utm_source=GitHub&utm_medium=Website&utm_campaign=OpenSource)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
