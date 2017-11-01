angular.module( "species" ).factory( "Species", [
	function()
	{
		function Species( tName, tCommonName, tImage )
		{
			this.name = tName;
			this.commonName = tCommonName;
			this.image = tImage;
		};
		
		return Species;
	}
] );