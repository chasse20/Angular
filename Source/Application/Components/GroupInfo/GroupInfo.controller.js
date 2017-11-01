angular.module( "species" ).controller( "GroupInfo", [ "Group", "Species",
	function( Group, Species )
	{
		this.$onInit = function()
		{
			this.isExpanded = true;
		};
		
		this.onCreate = function()
		{
			this.model.addChild( this.depth >= 4 ? new Species() : new Group() );
		};
	}
] );