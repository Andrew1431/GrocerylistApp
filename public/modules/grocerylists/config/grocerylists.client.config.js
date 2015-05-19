'use strict';

// Configuring the Articles module
angular.module('grocerylists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Grocerylists', 'grocerylists', 'dropdown', '/grocerylists(/create)?');
		Menus.addSubMenuItem('topbar', 'grocerylists', 'List Grocerylists', 'grocerylists');
		Menus.addSubMenuItem('topbar', 'grocerylists', 'New Grocerylist', 'grocerylists/create');
	}
]);