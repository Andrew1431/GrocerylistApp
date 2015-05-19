'use strict';

// Configuring the Articles module
angular.module('grocerylists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Groceries', 'grocerylists', 'dropdown', '/grocerylists(/create)?');
		Menus.addSubMenuItem('topbar', 'grocerylists', 'List Groceries', 'grocerylists');
		Menus.addSubMenuItem('topbar', 'grocerylists', 'Add Item', 'grocerylists/create');
	}
]);
