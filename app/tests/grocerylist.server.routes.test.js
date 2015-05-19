'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grocerylist = mongoose.model('Grocerylist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, grocerylist;

/**
 * Grocerylist routes tests
 */
describe('Grocerylist CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Grocerylist
		user.save(function() {
			grocerylist = {
				name: 'Grocerylist Name'
			};

			done();
		});
	});

	it('should be able to save Grocerylist instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grocerylist
				agent.post('/grocerylists')
					.send(grocerylist)
					.expect(200)
					.end(function(grocerylistSaveErr, grocerylistSaveRes) {
						// Handle Grocerylist save error
						if (grocerylistSaveErr) done(grocerylistSaveErr);

						// Get a list of Grocerylists
						agent.get('/grocerylists')
							.end(function(grocerylistsGetErr, grocerylistsGetRes) {
								// Handle Grocerylist save error
								if (grocerylistsGetErr) done(grocerylistsGetErr);

								// Get Grocerylists list
								var grocerylists = grocerylistsGetRes.body;

								// Set assertions
								(grocerylists[0].user._id).should.equal(userId);
								(grocerylists[0].name).should.match('Grocerylist Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Grocerylist instance if not logged in', function(done) {
		agent.post('/grocerylists')
			.send(grocerylist)
			.expect(401)
			.end(function(grocerylistSaveErr, grocerylistSaveRes) {
				// Call the assertion callback
				done(grocerylistSaveErr);
			});
	});

	it('should not be able to save Grocerylist instance if no name is provided', function(done) {
		// Invalidate name field
		grocerylist.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grocerylist
				agent.post('/grocerylists')
					.send(grocerylist)
					.expect(400)
					.end(function(grocerylistSaveErr, grocerylistSaveRes) {
						// Set message assertion
						(grocerylistSaveRes.body.message).should.match('Please fill Grocerylist name');
						
						// Handle Grocerylist save error
						done(grocerylistSaveErr);
					});
			});
	});

	it('should be able to update Grocerylist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grocerylist
				agent.post('/grocerylists')
					.send(grocerylist)
					.expect(200)
					.end(function(grocerylistSaveErr, grocerylistSaveRes) {
						// Handle Grocerylist save error
						if (grocerylistSaveErr) done(grocerylistSaveErr);

						// Update Grocerylist name
						grocerylist.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Grocerylist
						agent.put('/grocerylists/' + grocerylistSaveRes.body._id)
							.send(grocerylist)
							.expect(200)
							.end(function(grocerylistUpdateErr, grocerylistUpdateRes) {
								// Handle Grocerylist update error
								if (grocerylistUpdateErr) done(grocerylistUpdateErr);

								// Set assertions
								(grocerylistUpdateRes.body._id).should.equal(grocerylistSaveRes.body._id);
								(grocerylistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Grocerylists if not signed in', function(done) {
		// Create new Grocerylist model instance
		var grocerylistObj = new Grocerylist(grocerylist);

		// Save the Grocerylist
		grocerylistObj.save(function() {
			// Request Grocerylists
			request(app).get('/grocerylists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Grocerylist if not signed in', function(done) {
		// Create new Grocerylist model instance
		var grocerylistObj = new Grocerylist(grocerylist);

		// Save the Grocerylist
		grocerylistObj.save(function() {
			request(app).get('/grocerylists/' + grocerylistObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', grocerylist.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Grocerylist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grocerylist
				agent.post('/grocerylists')
					.send(grocerylist)
					.expect(200)
					.end(function(grocerylistSaveErr, grocerylistSaveRes) {
						// Handle Grocerylist save error
						if (grocerylistSaveErr) done(grocerylistSaveErr);

						// Delete existing Grocerylist
						agent.delete('/grocerylists/' + grocerylistSaveRes.body._id)
							.send(grocerylist)
							.expect(200)
							.end(function(grocerylistDeleteErr, grocerylistDeleteRes) {
								// Handle Grocerylist error error
								if (grocerylistDeleteErr) done(grocerylistDeleteErr);

								// Set assertions
								(grocerylistDeleteRes.body._id).should.equal(grocerylistSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Grocerylist instance if not signed in', function(done) {
		// Set Grocerylist user 
		grocerylist.user = user;

		// Create new Grocerylist model instance
		var grocerylistObj = new Grocerylist(grocerylist);

		// Save the Grocerylist
		grocerylistObj.save(function() {
			// Try deleting Grocerylist
			request(app).delete('/grocerylists/' + grocerylistObj._id)
			.expect(401)
			.end(function(grocerylistDeleteErr, grocerylistDeleteRes) {
				// Set message assertion
				(grocerylistDeleteRes.body.message).should.match('User is not logged in');

				// Handle Grocerylist error error
				done(grocerylistDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Grocerylist.remove().exec();
		done();
	});
});