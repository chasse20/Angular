/**
* @ngdoc controller
* @name species.controller:Content
* @description Controller for main content display
* @requires species.service:Data
* @requires species.service:Group
* @requires species.service:Species
*/
angular.module( "species" ).controller( "Content", [ "Data", "Group", "Species",
	function( Data, Group, Species )
	{
		this.data = Data;
		
		/**
		* @ngdoc method
		* @name species.controller:Content#$onInit
		* @description Creates dummy data
		* @methodOf species.controller:Content
		*/
		this.$onInit = function()
		{
			// Dummy data
			if ( this.data.kingdoms == null )
			{
				this.data.kingdoms = new Group( "Kingdoms" );
				
				var tempAnimalia = new Group( "Animalia" );
				this.data.kingdoms.addChild( tempAnimalia );
				
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
		};
	}
] );