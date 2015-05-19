'use strict';

//Setting up route
angular.module('grocerylists').config(['$stateProvider',
	function($stateProvider) {
		// Grocerylists state routing
		$stateProvider.
		state('listGrocerylists', {
			url: '/grocerylists',
			templateUrl: 'modules/grocerylists/views/list-grocerylists.client.view.html'
		}).
		state('createGrocerylist', {
			url: '/grocerylists/create',
			templateUrl: 'modules/grocerylists/views/create-grocerylist.client.view.html'
		}).
		state('viewGrocerylist', {
			url: '/grocerylists/:grocerylistId',
			templateUrl: 'modules/grocerylists/views/view-grocerylist.client.view.html'
		}).
		state('editGrocerylist', {
			url: '/grocerylists/:grocerylistId/edit',
			templateUrl: 'modules/grocerylists/views/edit-grocerylist.client.view.html'
		});
	}
]);