'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grocerylist Schema
 */
var GrocerylistSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter a name',
		trim: true
	},
    quantity: {
        type: Number,
        required: 'Please enter a quantity.'
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Grocerylist', GrocerylistSchema);
