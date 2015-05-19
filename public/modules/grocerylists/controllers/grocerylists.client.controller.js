'use strict';

// Grocerylists controller
angular.module('grocerylists').controller('GrocerylistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grocerylists',
	function($scope, $stateParams, $location, Authentication, Grocerylists) {
		$scope.authentication = Authentication;

		// Create new Grocerylist
		$scope.create = function() {
			// Create new Grocerylist object
			var grocerylist = new Grocerylists ({
				name: this.name
			});

			// Redirect after save
			grocerylist.$save(function(response) {
				$location.path('grocerylists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grocerylist
		$scope.remove = function(grocerylist) {
			if ( grocerylist ) { 
				grocerylist.$remove();

				for (var i in $scope.grocerylists) {
					if ($scope.grocerylists [i] === grocerylist) {
						$scope.grocerylists.splice(i, 1);
					}
				}
			} else {
				$scope.grocerylist.$remove(function() {
					$location.path('grocerylists');
				});
			}
		};

		// Update existing Grocerylist
		$scope.update = function() {
			var grocerylist = $scope.grocerylist;

			grocerylist.$update(function() {
				$location.path('grocerylists/' + grocerylist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grocerylists
		$scope.find = function() {
			$scope.grocerylists = Grocerylists.query();
		};

		// Find existing Grocerylist
		$scope.findOne = function() {
			$scope.grocerylist = Grocerylists.get({ 
				grocerylistId: $stateParams.grocerylistId
			});
		};
	}
]);