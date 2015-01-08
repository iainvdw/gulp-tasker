/* Gulp task loader and registration manager */

module.exports = (function () {
	'use strict';
	
	var requireDir = require('require-dir'),
		extend = require('extend'),
		allTasks = {},
		defaults = {
			path: 'gulp-tasks',
			recurse: true
		};

	return {
		/**
		 * Load all tasks from the `path` option
		 */
		loadTasks: function (opts) {
			var options = extend(true, defaults, opts);

			requireDir(process.cwd() + options.path, {recurse: options.recurse});
		},

		/**
		 * Register helper to let subtasks register themselves in the 'default' gulp task
		 *
		 * @param  {String} 		type 	Type of task to register
		 * @param  {String|Array} 	tasks 	Task name to register in 'default' task
		 * @param  {String|Array} 	folder 	Folder(s) to watch when registering a watch task
		 */
		addTask: function (type, tasks, folder) {
			if ( !type ) {
				throw Error('Error registering task: Please specify a task type');
			}

			if ( !tasks ) {
				throw Error('Error registering task: Please specify at least one task.');
			}

			allTasks[type] = allTasks[type] || {tasks: [], requireFolders: !!folder};

			if ( !folder && allTasks[type].requireFolders) {
				throw Error('Error registering watch type task: Please specify (a) folder(s) to watch.');
			}

			if ( !!folder ) { // Folder specified, tasks is a watch task

				// Convert argument to array if it's no array yet
				if ( !(tasks.constructor === Array) ) {
					tasks = [tasks];
				}

				allTasks[type].tasks = allTasks[type].tasks.concat({
					tasks: tasks,
					folders: folder
				});

			} else { // Regular tasks
				allTasks[type].tasks = allTasks[type].tasks.concat(tasks);
			}
		},

		/**
		 * Returns registered tasks of specified type
		 * 
		 * @param  {String} type Task list to get
		 * @return {Array}      Array with tasks
		 */
		getTasks: function (type) {
			var taskList = allTasks[type];

			if ( taskList ) {
				return taskList;
			} else {
				throw Error('No task list of type ' + type + ' is specfied');
			}
		}
	}
}());