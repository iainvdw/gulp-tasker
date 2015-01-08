# gulp-tasker
> Task loading and task registration for Gulp 3.x

## Introduction
The idea behind gulp-tasker is that you are able to create independent, small sub-tasks. These sub-tasks each have their own dependencies and target tasks. Previously you would create a gulpfile which would end up containing a couple of hundred lines of code when you have a significant number of tasks.

With gulp-tasker, each task (or bundle of related tasks for that matter) can be specified in a task folder. Each task folder would then contain .js file(s) that specify the tasks to be loaded. Also, you can register sub-tasks to 'global' tasks, such as the 'default' or 'watch' tasks.

## Installation
Install with npm: 

```npm install gulp-tasker```

## Usage
In your gulpfile.js, first expose gulp-tasker globally so gulp-tasker is also available in the scope of your sub-tasks:

```javascript
global.tasker = require('gulp-tasker');
```

### Task loading
Then, to load tasks from a folder, run the `tasker.loadTasks(options)` command:

```javascript
tasker.loadTasks({
	path: 'tasks',
	recurse: true
});
```
This loads the tasks recursively from the /tasks/ folder from the root of your project.

### Task registration
To register your sub-tasks to another task like the default task, use the `tasker.addTask(options)` method:

```javascript
tasker.addTask('default', 'js');
tasker.addTask('deploy', 'js');
```
To load these tasks from your gulpfile.js, add a `tasker.getTasks(name)` in the place where you would specify the task dependencies:

```javascript
gulp.task('default', tasker.getTasks('default').tasks);
```
This gets all the default tasks from the tasker plugin and returns the task list as an array as needed for gulp.
### Watch tasks
When specifying watch tasks, add a third argument to specify the folder to watch:

```javascript
tasker.addTask('watch', 'js', ['assets/js');
```
Watch tasks are a bit different than regular tasks, as watch tasks also need a specified folder to watch. To load the watch tasks from gulp-tasker, add the tasks like this:

```javascript
gulp.task('watch', function () {
	tasker.getTasks('watch').tasks.forEach(function(task) {
		gulp.watch(task.folders, task.tasks);
	});
});
```
Watch tasks are an object of two properties, the task name and the folder to watch. Using `forEach()` you can iterate over the watch task array and register each task with the `gulp.watch()` method.

## API
method 								| description
:----- 								| :----------
tasker.loadTasks(options) 			| Load all tasks from a folder<br>**options** (Object): options object containing `path` and `recurse` options.<br>**options.path** (String, default `'gulp-tasks'`): path to load tasks from<br>**options.recurse** (Boolean, default `true`): Whether to recursively load all folders within the specified path
tasker.addTask(type, task, folder)	| Register a task to a different task. Optional: specify a folder to register the task as a watch task<br>**type** (String): task to register new task to<br>**task** (String\|Array): task to register<br>**folder** (String\|Array, optional): folder to watch for changes
tasker.getTasks(type) 				| Get all tasks of a type<br>**type** (String): Task type to get from gulp-tasker. Corresponds with type specified via addTask()

## License
Copyright (C) 2014 Iain van der Wiel
Licensed under the MIT license.