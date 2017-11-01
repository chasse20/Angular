angular.module( "species" ).service( "Data", [ "Excel", "Group", "Species",
	function( Excel, Group, Species )
	{
		this.kingdoms = null;
		
		this.Import = function( tExcel )
		{
			//this.kingdoms = Excel.Import( tExcel, tCallback, tCallbackContext );
			this.kingdoms = new Group( "Kingdoms" );
			
			var tempAnimalia = new Group( "Animalia" );
			this.kingdoms.addChild( tempAnimalia );
			
			var tempChordata = new Group( "Chordata" );
			tempAnimalia.addChild( tempChordata );
			
			var tempMammalia = new Group( "Mammalia" );
			tempChordata.addChild( tempMammalia );
			
			var tempRodentia = new Group( "Rodentia" );
			tempMammalia.addChild( tempRodentia );
			
			var tempSciuridae = new Group( "Sciuridae" );
			tempRodentia.addChild( tempSciuridae );
			
			tempSciuridae.addChild( new Species( "Otospermophilus beecheyi", "California ground squirrel", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/California_ground_squirrel_at_Point_Lobos.jpg/800px-California_ground_squirrel_at_Point_Lobos.jpg" ) );
		};
		
		this.Export = function()
		{
			Excel.Export( this.kingdoms, "Species" );
		};
	}
] );