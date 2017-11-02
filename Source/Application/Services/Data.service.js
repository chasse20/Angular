angular.module( "species" ).service( "Data", [ "Excel", "Group", "Species",
	function( Excel, Group, Species )
	{
		this.kingdoms = null;
		
		this.Import = function( tExcel, $scope )
		{
			var tempOnImport = function( tKingdoms )
			{
				this.kingdoms = tKingdoms;
			
				// Dummy data if none given
				if ( this.kingdoms == null )
				{
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
				}
				
				$scope.$apply();
			};
			
			Excel.Import( tExcel, tempOnImport, this );
		};
		
		this.Export = function()
		{
			Excel.Export( this.kingdoms, "Species" );
		};
	}
] );