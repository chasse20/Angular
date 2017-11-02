/**
* @ngdoc component
* @name species.component:content
* @description Component for content display
*/
angular.module( "species" ).component( "content",
	{
		controller: "Content",
		controllerAs: "content",
		templateUrl: function( COMPONENT_PATH )
		{
			return COMPONENT_PATH + "Content/Content.html";
		}
	}
);