// Generated on 2014-02-03 using generator-webapp 0.4.7
'use strict';



module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    
    // Define the configuration for all the tasks
    grunt.initConfig({
        paths: {
            // Configurable paths
            app: 'app',
            dist: 'dist',
            bower: 'app/bower_components'
         },
 
        /* clean  : {
            dist : {
                files : [{
                    dot : true,
                    src : ['.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/.git*']
                }]
            },
	    },*/
        processhtml : {
            dist: {
                files: {
                    '<%= paths.dist %>/index.html': ['app/index.html'],
                    '<%= paths.dist %>/styles/app.css': ['app/app.css', '<%= paths.bower %>/normalize.css/normalize.css']
                }
            }
        },
        
        copy : {
            dist : {
			files : [ 
            //app files
            {
                expand : true,
				dot    : false,
				cwd    : '<%= paths.app %>',
				dest   : '<%= paths.dist %>',
				src    : [ '*.{ico,png,txt}', '.htaccess', 'images/{,*/}*.{webp,svg}', '{,*/}*.html', 'styles/fonts/{,*/}*.*']
            },
            //angular components
            {
                expand : true,
				dot    : false,
				cwd    : '<%= paths.app %>',
				dest   : '<%= paths.dist %>',
                src    : [ 'app.js', '{,*/}*.{component,filter,service}.js']
            },
            
            //bower libraries
            {
                expand : true,
                flatten: true,
                dot    : false,
                cwd    : '<%= paths.bower %>',
                dest   : '<%= paths.dist %>/lib/',
                src: [ 'lodash/dist/*.min.js', 'chart.js/dist/*.min.js', 'angular-chart.js/dist/*.min.js', 'svg.js/dist/*.min.js', 'angular/*.min.js', 'shortid/dist/*.min.js']
            }
            ]
            
        },
		styles : {
			expand : true,
			dot    : false,
			cwd    : '<%= paths.app %>/styles',
			dest   : '.tmp/styles/',
			src    : '{,*/}*.css'
		}
	    },
        bower: {
            dev: {
            dest: 'lib/',
            js_dest: 'lib/js',
            css_dest: 'lib/styles'
            }
      }
    });
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-clean');

    grunt.registerTask('build', [
        /*'clean:dist',*/
        /*'concat',*/
        /*'uglify',*/
        'copy:dist',
        'processhtml:dist'
    ]);

};