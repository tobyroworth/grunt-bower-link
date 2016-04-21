/*
 * grunt-bower-link
 * https://github.com/tobyroworth/grunt-bower-link
 *
 * Copyright (c) 2016 Toby Roworth
 * Licensed under the Apache-2.0 license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask("bower_link", function() {
		
		var async = require("async");
		var bower = require("bower");
		var path = require("path");
		
		var tasks = [];
		
		for (var i = 0; i < this.files.length; i++) {
			//TODO deduplicate
			
			var file = this.files[i];
			
			for (var j = 0; j < file.src.length; j++) {
				
				var srcFile = file.src[j];
				
				var done = this.async();
				
				var srcName = srcFile.match(/\/([^/]*)$/)[1]; //TODO use node's path.sep
				var fullSrc = path.resolve(srcFile);
				var fullDest = path.resolve(file.dest);
				
				//grunt.log.writeln("Linking " + srcFile + " (" + fullSrc + ")");
				
				tasks.push(function(bower, fullSrc, srcFile, callback) {bower.commands.link(undefined, undefined, {cwd: fullSrc})
					.on('log', function(result) {
						//grunt.log.writeln(result.message);
					}).on('error', function(result) {
						grunt.fail.fatal(result.message);
					}).on('end', function() {
						//grunt.fail.fatal();
						grunt.log.ok("Linked " + srcFile);
						callback();
					})}.bind(this, bower, fullSrc, srcFile));
				
				//grunt.log.writeln("Linking " + srcName + " in " + file.dest + " (" + fullDest + ")");
				
				tasks.push(function(bower, srcName, fullDest, dest, callback) {bower.commands.link(srcName, undefined, {cwd: fullDest})
					.on('log', function(result) {
						//grunt.log.writeln(result.message);
					})
					.on('error', function(result) {
						grunt.fail.fatal(result.message);
					})
					.on('end', function() {
						grunt.log.ok("Linked " + srcFile + " in " + dest);
						callback();
					})}.bind(this, bower, srcName, fullDest, file.dest));
				
			}
		}
		
		async.series(tasks, done);
	});

};
