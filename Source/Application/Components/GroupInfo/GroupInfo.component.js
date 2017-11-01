angular.module( "species" ).component( "groupInfo",
	{
		controller: "GroupInfo",
		controllerAs: "group",
		templateUrl: function( COMPONENT_PATH )
		{
			return COMPONENT_PATH + "GroupInfo/GroupInfo.html";
		},
		bindings:
		{
			depth: "<",
			index: "<",
			model: "<",
			parent: "<"
		}
	}
);