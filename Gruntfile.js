module.exports = function( grunt ){

  var banner = "/*/r/n *<%= pkg.name %>/r/n *<%= pkg.version %>/r/n *<%= pkg.git %>/r/n */";

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    less: {
      dev: {
        options: {
          paths: ['Development/less']
        },
        files: [
          {
            src: [ "Development/less/**/*.less" ],
            dest: "Development/css/<%= pkg.prefix %>main.css"
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
        src: [ 'angular/angular.min.*', 'jquery/dist/jquery.min.*'],
        dest: 'Production/js',
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
            src: 'Development/js/background/**/*.js',
            dest: 'Development/tmp/<%= pkg.prefix %>background-concat.js'
          },
          {
            src: 'Development/js/content/**/*.js',
            dest: 'Development/tmp/<%= pkg.prefix %>content-concat.js'
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
          }
        ]
      }
    },
    clean: {
      js: ['Development/tmp/**.js'],
      map: ['Development/tmp/**.map'],
      prod: ['Production/**/*']
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-copy' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );

  grunt.registerTask( 'dev', ['less:dev'] );
  grunt.registerTask( 'prod', ['clean:prod', 'less:prod', 'copy', 'concat', 'uglify', 'clean:js', 'clean:map'] );
  grunt.registerTask( 'run', ['dev', 'prod'] );
};