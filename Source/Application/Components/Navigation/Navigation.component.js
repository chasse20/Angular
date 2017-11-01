angular.module( "species" ).component( "navigation",
	{
		controller: "Navigation",
		controllerAs: "navigation",
		templateUrl: function( COMPONENT_PATH )
		{
			return COMPONENT_PATH + "Navigation/Navigation.html";
		},
		bindings:
		{
			form: "<",
		}
	}
);