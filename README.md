# Javascript Package Managers, Build Tools, & Scaffolding

## Javascript Package Managers
Tools that find, install, and manage versions of javascript packages (modules).

## Javascript Build Tools
Also called task runners. Tools used for automating application procedures:

- testing
- linting (code auditing)
- concatinating
- deployment

Similar to Rake in a Rails application.

## Scaffolding Tools
Tools for bootstrapping an application by setting up all of the initial directories and files, as well as the package managers and build tools.

### Javascript Packages
Bundles of code for use in an application, command line interfaces (CLIs), browser plugins, or any other reusable javascript. 

Common application packages:

- jquery
- concat
- uglify
- sass

### Using a Package Manager
Files are organized and versioned using a JSON metadata file

Multiple PMs can be used on a single project as each PM has its own metadata file and stores files in its own directory. (npm to manage server-side JS and Bower to manage client-side JS.)

1. Search packages
2. Install package
3. Initialize package at root of project
4. Save the package's version info to the metadata file

### Package Manager Benefits
Allows teams to share an application and guarantee correct versioning for all required javascripts. 

Similar to using a Gemfile and Bundler in a Rails application.

### Package Manager Drawbacks
Which package do I use?! [image of npm list for sass]

## Package Manager: npm
Node Package Manager. Node.js is a server-side javascript library. Node is the package manager package manager. [Simpsons truck truck image]

Download the Node installer https://nodejs.org/download/ (61.2mb). Installs Node.js and npm. Should be able to run `node -v` and get the version number. Currently at `v0.12.0`.

npm gets updated more frequently than Node.js does. Update npm with `sudo npm install npm --global`. 

### Locally Installing npm Packages
#### Without package.json
```
npm install lodash
```

Then require the module directly in the code

```
var lodash = require("lodash");
```
#### With package.json
If we have a `package.json` file in our directory we just run `npm install` which will install all packages in the file.

    {
      "name": "demo-app",
      "version": "1.0.0"
    }
    
Then if we install the package using the `--save` flag the package metadata will be added to the JSON tree as a dependency.

```
npm install lodash --save
```
    
    {
      "name": "package-managers",
      "version": "0.0.1",
      "dependencies": {
        "lodash": "^3.5.0"
      }
    }

## Package Manager: Bower
### Installation
Requires node, npm, and git.

    npm install -g bower
    
Install packages with `bower install`. Can pass the `--save` or `--save-dev` arguments. Bower installs packages to `bower_components/`.

### bower.json
Manifest file, same as npm `package.json`.

Interactively create a bower.json with `bower init`.

    {
      "name": "my-project",
      "version": "1.0.0",
      "main": "path/to/main.css", // primary acting files
      "ignore": [
        ".jshintrc",
        "**/*.txt"
      ],
      "dependencies": { // for production
        "<name>": "<version>",
        "<name>": "<folder>",
        "<name>": "<package>"
      },
      "devDependencies": { // for development
        "<test-framework-name>": "<version>"
      }
    }
    
### Maintaining Dependencies

Add a package to bower.json `dependencies` or `devDependencies` with `install <package> --save` and `install <package> --save-dev`, respectively.

### Registering a Package
Registering your package allows others to install it with a short name, like `bower install <my-package-name>`.

Register a package with

    bower register <my-package-name> <git-endpoint>
    
### API Notables
#### home

    bower home
    bower home <package>
    bower home <package>#<version>

Opens a package homepage into your browser.

If no `<package>` is passed, opens the homepage of the local package.

### Consuming a package
Source mapping can be used by build tools to easily consume Bower packages.

    bower list --paths
    bower list --paths --json

    {
      "backbone": "bower_components/backbone/backbone.js",
      "jquery": "bower_components/jquery/dist/jquery.js",
      "underscore": "bower_components/underscore/underscore.js"
    }
    
Every command supports the `--json` option.

### Programmatic API
All commands can be accessed through the `bower.commands` object.

    var bower = require('bower');

    bower.commands
      .install(['jquery'], { save: true }, { /* config */ })
      .on('end', function (installed) {
        console.log(installed);
      });

### Running on CI
Bower will skip some interactive and analytics operations if it finds a CI environmental variable set to true. You will find that the CI variable is already set for you on many continuous integration servers, e.g., CircleCI and Travis-CI.

You may try to set the CI variable manually before running your Bower commands. On Mac or Linux, `export CI=true`.

### Configuration
`.bowerrc` file

    {
      "directory": "app/components/",
      "analytics": false,
      "timeout": 120000,
      "registry": {
        "search": [
          "http://localhost:8000",
          "https://bower.herokuapp.com"
        ]
      }
    }
 
### Tools and Integration
Integrates with Grunt, Gulp, Ruby, Rails. [http://bower.io/docs/tools/]()

**d-i/half-pipe** Gem to replace the Rails asset pipeline with a Grunt-based workflow, providing dependencies via Bower.

## Difference Between npm & Bower
Bower has flat dependency tree, one version of each package. Optimized for the browser. Faster page load.

npm has a nested dependency tree, can load different versions of packages for each requirement. More flexible, don't have to worry about dependency version collisions.

## Private Packages
[Private npm image]

## Build Tool: Grunt
Grunt and Grunt plugins are installed and managed via npm.

### Grunt Command Line Interface
Install the CLI globally

    npm install -g grunt-cli
   
We can now run the `grunt` command, which looks for a locally installed Grunt using node's require() system. If a locally installed Grunt is found, the CLI loads the local installation of the Grunt library, applies the configuration from your `Gruntfile`, and executes any tasks you've requested for it to run.

### Grunt Project Setup

#### package.json
List grunt and the Grunt plugins your project needs as `devDependencies` in this file. (`grunt-init` is another way to create the package.json file.)

    {
      "name": "my-project-name",
      "version": "0.1.0",
      "devDependencies": {
        "grunt": "~0.4.5",
        "grunt-contrib-jshint": "~0.10.0",
        "grunt-contrib-nodeunit": "~0.4.1",
        "grunt-contrib-uglify": "~0.5.0"
      }
    }

#### Gruntfile
Named `Gruntfile.js` or `Gruntfile.coffee` and used to configure or define tasks and load Grunt plugins.

    module.exports = function(grunt) {
      grunt.initConfig({
        jshint: {
          files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
          options: {
            globals: {
              jQuery: true
            }
          }
        },
        watch: {
          files: ['<%= jshint.files %>'],
          tasks: ['jshint']
        }
      });

      grunt.loadnpmTasks('grunt-contrib-jshint');
      grunt.loadnpmTasks('grunt-contrib-watch');

      grunt.registerTask('default', ['jshint']);
    };

Add Grunt and gruntplugins to an existing package.json is with

    npm install <module> --save-dev. 
    
This will install the module locally and add it to the devDependencies section, using a tilde version range.

##### Notable plugins and elements of the Gruntfile

    pkg: grunt.file.readJSON('package.json')
    
For reading values in from the package.json.
    
###### watch
When a file in the `files:` array is modified, tasks in the `tasks:` array will be executed.

###### jshint
For linting JS files.

###### uglify
For minifying production files.

### Configuration
Specified via the grunt.initConfig method. Listed by task, but may contain any arbitrary data.

When a task is run, Grunt looks for its configuration under a property of the same name. Multi-tasks can have multiple configurations, defined using arbitrarily named "targets."

    grunt.initConfig({
      concat: {
        foo: {
          // concat task "foo" target options and files
        },
        bar: {
          // concat task "bar" target options and files
        }
    )}
    
These tasks can be run individually with `grunt concat:foo` or `grunt concat:bar`, or all together with `grunt concat`.

Inside a task configuration, an `options` property may be specified to override built-in defaults.

    grunt.initConfig({
      concat: {
        options: {
          // Task-level options may go here, overriding task defaults.
        },
        foo: {
          options: {
            // "foo" target options may go here, overriding task-level options.
          }
    ...
    
### Files
There are several ways to define source-destination file mappings, offering varying degrees of verbosity and control. Any multi task will understand all the following formats.

All files formats support `src` and `dest` but the "Compact" and "Files Array" formats support a few additional properties like `filter`, `nonull`, and `expand`.

#### Building the files object dynamically

    grunt.initConfig({
      uglify: {
        // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'lib/',      // Src matches are relative to this path.
            src: ['**/*.js'], // Actual pattern(s) to match.
            dest: 'build/',   // Destination path prefix.
            ext: '.min.js',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
    ...
    
### Templates
Templates specified using `<%= %>` delimiters will be automatically expanded when tasks read them from the config. Additionally, grunt and its methods are available inside templates, eg. `<%= grunt.template.today('yyyy-mm-dd') %>`.

### Creating Tasks
Every time Grunt is run, you specify one or more tasks to run, which tells Grunt what you'd like it to do.

To group a set of tasks under one alias:

    grunt.registerTask(taskName, [description, ] taskList)
   
Where `taskList` is an array of tasks.

To execute a default list of tasks each time `grunt` is run:

    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify'])
    
#### Basic Tasks
Singleton tasks that don't take configuration options, just accept a function to execute.

    grunt.registerTask('foo', 
      'A sample task that logs stuff.', 
      function(arg1, arg2) {
        // do something

## Build Tool: Gulp
"Preferring code over configuration"

Whereas Grunt creates output from each plugin and sends it into the next plugin, producing intermediate files along the way, Gulp creates virtual files and "pipes" them into each plugin. No intermediate files written, making it much faster.

Install:

    npm install --global gulp
    npm install --save-dev gulp
    
Create `gulpfile.js`:

    var gulp = require('gulp');

    gulp.task('default', function() {
      // place code for your default task here
    });
    
### API

#### gulp.src(globs[, options])

Emits files matching provided glob or an array of globs. Returns a stream of Vinyl files that can be piped to plugins.

    gulp.src('client/templates/*.jade')
      .pipe(jade())
      .pipe(minify())
      .pipe(gulp.dest('build/minified_templates'));
      
#### gulp.dest(path[, options])

Writes files. Re-emits all data passed to it so you can pipe to multiple folders.

    gulp.dest('./build/minified_templates')

The write path is calculated by appending the file relative path to the given destination directory.

#### gulp.task(name[, deps], fn)

Define a task using Orchestrator.

    gulp.task('somename', function() {
      // Do stuff
    });
    
Pass in dependent tasks which must be run before your task:

    gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
    
#### gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, callback])
Watch files and do something when a file changes. Returns an EventEmitter that emits change events.

    var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
    watcher.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    
### Orchestrator
A module for sequencing and executing tasks and dependencies in maximum concurrency

#### Load it up with stuff to do:

    orchestrator.add('thing1', function(){
      // do stuff
    });
    orchestrator.add('thing2', function(){
      // do stuff
    });

#### Run the tasks:

    orchestrator.start('thing1', 'thing2', function (err) {
      // all done
    });
    
### Plugins
Gulp plugins tend to be smaller in scope than Grunt plugins. This makes for smaller files, and likewise more required plugins listed in the Gulpfile.

 
      
## Scaffolding: Yeoman (Yo)
"Yeoman Workflow" consists of Yo, Bower, and a build tool (Grunt or Gulp).

Employs scaffolding templates called _generators_.

### Installation

    npm install -g yo bower grunt-cli gulp
    
### Basic Web App Scaffolding

Install the `generator-webapp` generator:

    npm install -g generator-webapp
    
This will scaffold out a project containing

- HTML5 Boilerplate
- jQuery
- Modernizr
- Bootstrap

Prompts during setup allow us to exclude particular features. This generator uses Grunt.

Inside of an empty directory run

    yo webapp
    
### AngularJS Scaffolding

    npm install -g generator-angular
    yo angular --coffee

(Many generators allow us to customize w/ flags like `--coffee`.)

This creates boilerplate directives and controllers as well as scaffolded Karma unit tests.

### Sub-Generators
For building out pieces of an application like controllers, directives, etc. 

    yo angular:controller myController
    yo angular:directive myDirective
    yo angular:filter myFilter
    yo angular:service myService    
    
We can also [create our own generators](http://yeoman.io/authoring).
    
## What We Didn't Discuss
### Browserify
### Component (http://componentjs.com/)
### jspm.io (http://jspm.io/)
### Jam (http://jamjs.org/)
### Duo (http://duojs.org/)

## Troubleshooting
Trouble installing and running global node modules: don't want to have to use `sudo` for installing packages but keep getting error message when installing and trying to run grunt, gulp, etc.

Solution is to modify where npm puts packages and make your user the owner of that directory.

	$ npm config set prefix /usr/local
	$ sudo chown yourusername /usr/local
	$ npm install -g bower

	$ which bower
	>> /usr/local/bin/bower

## Links
- [Notes](https://github.com/taylorkearns/js_package_managers)
- [Slides](https://slidebean.com/p/t8i7lhUTpr/Javascript-Package-Managers-Build-Tools--Scaffolding)
- [Better Web App Development Through Tooling (Video)](http://www.youtube.com/watch?feature=player_embedded&v=Mk-tFn2Ix6g)
- [Walkthrough video](http://tagtree.tv/gulp)
- [Mike Goodyear, Getting Started with Gulp](http://markgoodyear.com/2014/01/getting-started-with-gulp/) and his [comparison of a gulpfile and a Gruntfile](https://gist.github.com/markgoodyear/8497946#file-gruntfile-js)
- [Gulp cheatsheets](https://github.com/osscafe/gulp-cheatsheet)


