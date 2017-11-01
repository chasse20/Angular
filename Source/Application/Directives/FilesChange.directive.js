angular.module( "species" ).directive( "onFilesChange",
	function()
	{
		return {
			restrict: "A",
			link: function( tScope, tElement, tAttributes )
			{
				var tempDelegate = tScope.$eval( tAttributes.onFilesChange );
				var tempContext = tScope.$eval( tAttributes.onFilesChangeContext );
				tElement.bind( "change",
					function( event )
					{
						tempDelegate.call( tempContext, event );
					}
				);
			}
		};
	}
);