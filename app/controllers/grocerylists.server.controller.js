'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Grocerylist = mongoose.model('Grocerylist'),
	_ = require('lodash');

/**
 * Create a Grocerylist
 */
exports.create = function(req, res) {
	var grocerylist = new Grocerylist(req.body);
	grocerylist.user = req.user;

	grocerylist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocerylist);
		}
	});
};

/**
 * Show the current Grocerylist
 */
exports.read = function(req, res) {
	res.jsonp(req.grocerylist);
};

/**
 * Update a Grocerylist
 */
exports.update = function(req, res) {
	var grocerylist = req.grocerylist ;

	grocerylist = _.extend(grocerylist , req.body);

	grocerylist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocerylist);
		}
	});
};

/**
 * Delete an Grocerylist
 */
exports.delete = function(req, res) {
	var grocerylist = req.grocerylist ;

	grocerylist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocerylist);
		}
	});
};

/**
 * List of Grocerylists
 */
exports.list = function(req, res) { 
	Grocerylist.find().sort('-created').populate('user', 'displayName').exec(function(err, grocerylists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grocerylists);
		}
	});
};

/**
 * Grocerylist middleware
 */
exports.grocerylistByID = function(req, res, next, id) { 
	Grocerylist.findById(id).populate('user', 'displayName').exec(function(err, grocerylist) {
		if (err) return next(err);
		if (! grocerylist) return next(new Error('Failed to load Grocerylist ' + id));
		req.grocerylist = grocerylist ;
		next();
	});
};

/**
 * Grocerylist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.grocerylist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
