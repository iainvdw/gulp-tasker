/* Gulp task loader and registration manager */

module.exports = function (options) {
	'use strict';
	
	var requireDir = require('require-dir'),
		extend = require('extend'),
		allTasks = {
			default: [],
			deploy: [],
			watch: []
		},
		defaults = {
			path: 'gulp-tasks',
			recurse: true
		};

	options = extend(true, defaults, options);

	requireDir(options.tasks, {recurse: options.recurse});

	return {
		/**
		 * Register helper to let subtasks register themselves in the 'default' gulp task
		 *
		 * @param  {String} type Type of task to register ('default', 'deploy' or 'watch' task)
		 * @param  {String|Array} tasks Task name to register in 'default' task
		 * @param  {String|Array} folder Folder to watch when registering a watch task
		 */
		addTask: function (type, tasks, folder) {
			if ( !type ) {
				throw Error('Error registering task: Please specify a task type (default, deploy or watch).');
				return;
			}

			if ( !tasks ) {
				throw Error('Error registering task: Please specify at least one task.');
				return;
			}

			switch (type) {
				case 'default':
					allTasks.default = allTasks.default.concat(tasks);
					break;
				case 'deploy':
					allTasks.deploy = allTasks.deploy.concat(tasks);
					break;
				case 'watch':
					if ( !folder ) {
						throw Error('Error registering watch task: Please specify a folder to watch.');
						return;
					}

					if ( !(tasks.constructor === Array) ) {
						tasks = [tasks];
					}

					allTasks.watch = allTasks.watch.concat({
						tasks: tasks,
						folders: folder
					});

					break;
				default:
					throw Error('Error: Incorrect task type specified.');
					break;
			}
		},

		getTasks: function (type) {
			var taskList = allTasks[type];

			console.log(taskList);

			if ( taskList ) {
				return taskList;
			} else {
				throw Error('No task list of type ' + type + ' are specfied');
			}
		}
	}
};