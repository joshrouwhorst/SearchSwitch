module.exports = function( grunt ){

  var banner = "/* <%= pkg.name %> / <%= pkg.version %> / <%= pkg.git %> */";

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    less: {
      dev: {
        options: {
          paths: ['Development/less']
        },
        files: [
          {
            src: [ "Development/less/main.less" ],
            dest: "Development/css/<%= pkg.prefix %>main.css"
          },
          {
            src: [ 'Development/less/popup.less' ],
            dest: 'Development/css/<%= pkg.prefix %>popup.css'
          }
        ]
      },
      prod: {
        strictMath: true,
        strictUnits: true,
        sourceMap: true,
        sourceMapFilename: "Production/css/<%= pkg.prefix %>main.css.map",
        options: {
          paths: ['Development/less']
        },
        files: [
          {
            src: [ "Development/less/**/*.less" ],
            dest: "Production/css/<%= pkg.prefix %>main.css"
          }
        ]
      }
    },
    copy: {
      resources: {
        expand: true,
        cwd: 'Development/',
        src: [ '**/*.html', 'images/**/*.*', 'manifest.json' ],
        dest: 'Production/'
      },
      bower: {
        expand: true,
        cwd: 'Development/bower_components',
        src: [ 'angular/angular.min.js', 'jquery/dist/jquery.min.js', 'angular-route/angular-route.min.js' ],
        dest: 'Production/js',
        flatten: true
      },
      dev: {
        expand: true,
        cwd: 'Development/bower_components',
        src: [ 'angular/angular.min.js', 'jquery/dist/jquery.min.js', 'angular-route/angular-route.min.js' ],
        dest: 'Development/js',
        flatten: true
      }
    },
    concat: {
      js: {
        options: {
          stripBanners: true,
          banner: banner
        },
        files: [
          {
            src: 'Development/js/**/*background*.js',
            dest: 'Development/tmp/<%= pkg.prefix %>background-concat.js'
          },
          {
            src: 'Development/js/**/*content*.js',
            dest: 'Development/tmp/<%= pkg.prefix %>content-concat.js'
          },
          {
            src: 'Development/js/popup/**/*.js',
            dest: 'Development/js/popup.js'
          }
        ]
      }
    },
    uglify: {
      js: {
        options: {
          sourceMap: true,
          sourceMapName: 'Production/js/<%= pkg.prefix %>source.map'
        },
        files: [
          {
            src: 'Development/tmp/*background-concat.js',
            dest: 'Production/js/<%= pkg.prefix %>background.js'
          },
          {
            src: 'Development/tmp/*content-concat.js',
            dest: 'Production/js/<%= pkg.prefix %>content.js'
          },
          {
            src: 'Development/js/popup.js',
            dest: 'Production/js/popup.js'
          }
        ]
      }
    },
    clean: {
      js: ['Development/tmp/**.js'],
      map: ['Development/tmp/**.map'],
      prod: ['Production/**/*']
    },
    watch: {
      js: {
        files: ['Development/js/**/*.js']
      },
      autoCompile: {
        files: ['Development/**'],
        tasks: ['run'],
        options: {
          debounceDelay: 500,
          reload: true
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-copy' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );

  grunt.registerTask( 'dev', ['less:dev', 'copy:dev'] );
  grunt.registerTask( 'prod', ['clean:prod', 'less:prod', 'copy', 'concat', 'uglify', 'clean:js', 'clean:map'] );
  grunt.registerTask( 'run', ['dev', 'prod'] );
};