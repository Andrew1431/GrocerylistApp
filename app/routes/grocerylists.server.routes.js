'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var grocerylists = require('../../app/controllers/grocerylists.server.controller');

	// Grocerylists Routes
	app.route('/grocerylists')
		.get(grocerylists.list)
		.post(users.requiresLogin, grocerylists.create);

	app.route('/grocerylists/:grocerylistId')
		.get(grocerylists.read)
		.put(users.requiresLogin, grocerylists.hasAuthorization, grocerylists.update)
		.delete(users.requiresLogin, grocerylists.hasAuthorization, grocerylists.delete);

	// Finish by binding the Grocerylist middleware
	app.param('grocerylistId', grocerylists.grocerylistByID);
};
