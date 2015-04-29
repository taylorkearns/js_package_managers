module.exports = function(grunt) {
  grunt.initConfig({
    coffee: {
      compile: {
        files: {
          "dest/demo-app.js": ["src/*.coffee"]
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "dest/main.css": "src/main.scss"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-sass");

  grunt.registerTask("work", ["coffee", "sass"]);
}
