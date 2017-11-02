/**
* @ngdoc controller
* @name species.controller:Content
* @description Controller for main content display
* @requires species.service:Data
*/
angular.module( "species" ).controller( "Content", [ "Data",
	function( Data )
	{
		this.data = Data;
	}
] );