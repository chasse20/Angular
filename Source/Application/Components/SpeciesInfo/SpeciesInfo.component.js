angular.module( "species" ).component( "speciesInfo",
	{
		controller: "SpeciesInfo",
		controllerAs: "species",
		templateUrl: function( COMPONENT_PATH )
		{
			return COMPONENT_PATH + "SpeciesInfo/SpeciesInfo.html";
		},
		bindings:
		{
			index: "<",
			model: "<",
			parent: "<"
		}
	}
);