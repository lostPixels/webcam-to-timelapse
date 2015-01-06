'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: ['app/*','app/**','server.js']
				}
			}
		},

	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);



	// Default task(s).
	grunt.registerTask('default', ['nodemon']);
};