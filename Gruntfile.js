// Generated on 2014-02-03 using generator-webapp 0.4.7
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var options = {
        // Project settings
        paths: {
           // Configurable paths
           app: 'app',
           dist: 'dist'
        }	
    };

    // Define the configuration for all the tasks
    grunt.initConfig({
          clean  : {
		dist : {
		       files : [{
				dot : true,
				src : ['.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/.git*']
			}]
		},
	},
        copy : {
		dist : {
			files : [ {
				expand : true,
				dot    : false,
				cwd    : '<%= paths.app %>',
				dest   : '<%= paths.dist %>',
				src    : [ '*.{ico,png,txt}', '.htaccess', 'images/{,*/}*.webp', '{,*/}*.html', 'styles/fonts/{,*/}*.*' ]
			}]
		},
		styles : {
			expand : true,
			dot    : false,
			cwd    : '<%= paths.app %>/styles',
			dest   : '.tmp/styles/',
			src    : '{,*/}*.css'
		}
	},

    });

    grunt.registerTask('build', [
        /*'clean:dist',*/
        /*'concat',*/
        /*'uglify',*/
        'copy:dist'
    ]);

};