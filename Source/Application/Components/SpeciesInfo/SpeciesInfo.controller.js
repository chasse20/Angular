/**
* @ngdoc controller
* @name species.controller:SpeciesInfo
* @description Controller for displaying a Species block
*/
angular.module( "species" ).controller( "SpeciesInfo", [
	function()
	{
		/**
		* @ngdoc property
		* @name species.controller:SpeciesInfo#isExpanded
		* @description Toggles hierarchy visibility
		* @propertyOf species.controller:SpeciesInfo
		* @returns {boolean} True if expanded
		*/
		this.isExpanded = false;
		
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
