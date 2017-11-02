angular.module( "species" ).controller( "Navigation", [ "Data", "$scope",
	function( Data, $scope )
	{
		this.onFilesChanged = function( event )
		{
			Data.Import( event.target.files[0], $scope );
		};
		
		this.export = function()
		{
			Data.Export();
		};
	}
] );