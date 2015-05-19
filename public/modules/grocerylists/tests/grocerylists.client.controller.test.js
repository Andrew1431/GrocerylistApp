'use strict';

(function() {
	// Grocerylists Controller Spec
	describe('Grocerylists Controller Tests', function() {
		// Initialize global variables
		var GrocerylistsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Grocerylists controller.
			GrocerylistsController = $controller('GrocerylistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grocerylist object fetched from XHR', inject(function(Grocerylists) {
			// Create sample Grocerylist using the Grocerylists service
			var sampleGrocerylist = new Grocerylists({
				name: 'New Grocerylist'
			});

			// Create a sample Grocerylists array that includes the new Grocerylist
			var sampleGrocerylists = [sampleGrocerylist];

			// Set GET response
			$httpBackend.expectGET('grocerylists').respond(sampleGrocerylists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grocerylists).toEqualData(sampleGrocerylists);
		}));

		it('$scope.findOne() should create an array with one Grocerylist object fetched from XHR using a grocerylistId URL parameter', inject(function(Grocerylists) {
			// Define a sample Grocerylist object
			var sampleGrocerylist = new Grocerylists({
				name: 'New Grocerylist'
			});

			// Set the URL parameter
			$stateParams.grocerylistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/grocerylists\/([0-9a-fA-F]{24})$/).respond(sampleGrocerylist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grocerylist).toEqualData(sampleGrocerylist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Grocerylists) {
			// Create a sample Grocerylist object
			var sampleGrocerylistPostData = new Grocerylists({
				name: 'New Grocerylist'
			});

			// Create a sample Grocerylist response
			var sampleGrocerylistResponse = new Grocerylists({
				_id: '525cf20451979dea2c000001',
				name: 'New Grocerylist'
			});

			// Fixture mock form input values
			scope.name = 'New Grocerylist';

			// Set POST response
			$httpBackend.expectPOST('grocerylists', sampleGrocerylistPostData).respond(sampleGrocerylistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grocerylist was created
			expect($location.path()).toBe('/grocerylists/' + sampleGrocerylistResponse._id);
		}));

		it('$scope.update() should update a valid Grocerylist', inject(function(Grocerylists) {
			// Define a sample Grocerylist put data
			var sampleGrocerylistPutData = new Grocerylists({
				_id: '525cf20451979dea2c000001',
				name: 'New Grocerylist'
			});

			// Mock Grocerylist in scope
			scope.grocerylist = sampleGrocerylistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/grocerylists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/grocerylists/' + sampleGrocerylistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid grocerylistId and remove the Grocerylist from the scope', inject(function(Grocerylists) {
			// Create new Grocerylist object
			var sampleGrocerylist = new Grocerylists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Grocerylists array and include the Grocerylist
			scope.grocerylists = [sampleGrocerylist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/grocerylists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrocerylist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.grocerylists.length).toBe(0);
		}));
	});
}());