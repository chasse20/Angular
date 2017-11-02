/**
* @ngdoc controller
* @name species.controller:Navigation
* @description Controller for displaying navigation and import/export controls
* @requires species.service:Data
* @requires $scope
*/
angular.module( "species" ).controller( "Navigation", [ "Data", "$scope",
	function( Data, $scope )
	{
		/**
		* @ngdoc method
		* @name species.controller:Navigation#onFilesChanged
		* @description Callback for user file input
		* @methodOf species.controller:Navigation
		* @param {object} event Event for callback
		*/
		this.onFilesChanged = function( event )
		{
			Data.Import( event.target.files[0], $scope );
		};
		
		/**
		* @ngdoc method
		* @name species.controller:Navigation#export
		* @description Function to export current data
		* @methodOf species.controller:export
		*/
		this.export = function()
		{
			Data.Export();
		};
	}
] );