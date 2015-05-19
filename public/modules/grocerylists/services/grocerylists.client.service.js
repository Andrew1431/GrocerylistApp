'use strict';

//Grocerylists service used to communicate Grocerylists REST endpoints
angular.module('grocerylists').factory('Grocerylists', ['$resource',
	function($resource) {
		return $resource('grocerylists/:grocerylistId', { grocerylistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);