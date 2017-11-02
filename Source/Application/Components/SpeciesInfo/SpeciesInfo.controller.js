/**
* @ngdoc controller
* @name species.controller:SpeciesInfo
* @description Controller for displaying a Species block
*/
angular.module( "species" ).controller( "SpeciesInfo", [
	function()
	{
		/**
		* @ngdoc method
		* @name species.controller:SpeciesInfo#$onInit
		* @description Instantiates expanded state
		* @methodOf species.controller:SpeciesInfo
		*/
		this.$onInit = function()
		{
			this.isExpanded = true;
		};
	}
] );