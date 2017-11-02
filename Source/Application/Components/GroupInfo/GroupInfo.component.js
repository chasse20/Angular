/**
* @ngdoc component
* @name species.component:groupInfo
* @description Component for Group block display
* @param {int} depth Depth of group block
* @param {int} index Relative index of Group block in its parent's children
* @param {object} model Group model instance
* @param {object} parent Parent Group model instance
*/
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