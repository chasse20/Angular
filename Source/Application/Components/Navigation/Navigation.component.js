/**
* @ngdoc component
* @name species.component:navigation
* @description Component for header navigation display
*/
angular.module( "species" ).component( "navigation",
	{
		controller: "Navigation",
		controllerAs: "navigation",
		templateUrl: function( COMPONENT_PATH )
		{
			return COMPONENT_PATH + "Navigation/Navigation.html";
		}
	}
);