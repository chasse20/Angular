/**
* @ngdoc controller
* @name species.controller:Content
* @description Controller for main content display
* @requires species.service:Data
*/
angular.module( "species" ).controller( "Content", [ "Data",
	function( Data )
	{
		/**
		* @ngdoc property
		* @name species.controller:Content#data
		* @description Reference to Data singleton so it can be used in HTML
		* @propertyOf species.controller:Content
		* @returns {Data} Data singleton reference
		*/
		this.data = Data;
		
		/**
		* @ngdoc method
		* @name species.controller:Content#$onInit
		* @description Populates dummy data
		* @methodOf species.controller:Content
		*/
		this.$onInit = function()
		{
			this.data.Populate();
		};
	}
] );
