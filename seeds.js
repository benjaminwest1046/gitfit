var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


var User = require('./models/user');
var Goal = require('./models/goal');

// var User = require('./models/users');
// var Goals = require('./models/goals');

mongoose.connect('mongodb://localhost/project3-fitness');

// our script will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}


console.log('removing old goals...');
Goal.remove({})
.then(function() {
  console.log('removing old users...');
  return User.remove({});
})
.then(function() {
  console.log('creating new users');
  let goal1 = new User();
  goal1.local = { email: 'goal1@ga.co', password: goal1.encrypt('test1234') };
  let goal2 = new User();
  goal2.local = { email: 'goal2@ga.co', password: goal2.encrypt('test1234') };
  return [User.create(goal1), User.create(goal2)];
})
.spread(function(goal1, goal2) {
  console.log('creating some new goals...');
  var run1    = new Goal({ title: 'First run',  dateToComplete: Date() , distance: 20, time: '300', completed: true, user: goal1._id });
  var run2   = new Goal({ title: 'Second run',  dateToComplete: Date() , distance: 10, time: '130', completed: false, user: goal1._id });
  var weightlift1 = new Goal({ title: 'First weightlift', dateToComplete: Date(), sets: 20, reps: 20, muscleGroup: "Chest", completed: true, user: goal2._id });
  var weightlift2 = new Goal({ title: 'Second weightlift', dateToComplete: Date(), sets: 10, reps: 20, muscleGroup: "Legs",completed: false, user: goal2._id });
  return Goal.create([run1, run2, weightlift1, weightlift2]);
})
.then(function(savedGoals) {
  console.log('Saved...', savedGoals.length, 'goals.');
  return Goal.find({}).populate('user');
})
.then(function(allGoals) {
  console.log('Printing all goals:');
  allGoals.forEach(function(goal) {
    console.log(goal.toString());
  });
  quit();
}, function(err) {
  return handleError(err);
});




//completed: { type: Boolean, required: true },
// user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
//  },


// var mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');

// var User = require('./models/user');
// var Todo = require('./models/todo');

// mongoose.connect('mongodb://localhost/project3-fitness');

// // our script will not exit until we have disconnected from the db.
// function quit() {
//   mongoose.disconnect();
//   console.log('\nQuitting!');
// }

// // a simple error handler
// function handleError(err) {
//   console.log('ERROR:', err);
//   quit();
//   return err;
// }

// console.log('removing old todos...');
// Todo.remove({})
// .then(function() {
//   console.log('removing old users...');
//   return User.remove({});
// })
// .then(function() {
//   console.log('creating new users');
//   let joe = new User();
//   joe.local = { email: 'joe@ga.co', password: joe.encrypt('test1234') };
//   let sue = new User();
//   sue.local = { email: 'sue@ga.co', password: sue.encrypt('test1234') };
//   return [User.create(joe), User.create(sue)];
// })
// .spread(function(joe, sue) {
//   console.log('creating some new todos...');
//   var groceries    = new Todo({ title: 'groceries',       completed: false, user: joe._id });
//   var feedTheCat   = new Todo({ title: 'feed the cat',    completed: true,  user: joe._id });
//   var learnAngular = new Todo({ title: 'Learn AngularJS', completed: true,  user: sue._id });
//   var updateResume = new Todo({ title: 'Update Resume',   completed: false, user: sue._id });
//   return Todo.create([groceries, feedTheCat, learnAngular, updateResume]);
// })
// .then(function(savedTodos) {
//   console.log('Just saved', savedTodos.length, 'todos.');
//   return Todo.find({}).populate('user');
// })
// .then(function(allTodos) {
//   console.log('Printing all todos:');
//   allTodos.forEach(function(todo) {
//     console.log(todo.toString());
//   });
//   quit();
// }, function(err) {
//   return handleError(err);
// });
