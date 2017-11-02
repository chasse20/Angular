/**
* @ngdoc component
* @name species.component:speciesInfo
* @description Component for Species block display
* @param {int} index Relative index of species block in its parent's children
* @param {object} model Species model instance
* @param {object} parent Parent Group model instance
*/
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