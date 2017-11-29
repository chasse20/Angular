/**
* @ngdoc service
* @name species.service:Data
* @description Singleton for data
* @requires species.service:Excel
* @requires species.service:Group
* @requires species.service:Species
*/
angular.module( "species" ).service( "Data", [ "Excel", "Group", "Species",
	function( Excel, Group, Species )
	{
		/**
		* @ngdoc property
		* @name species.service:Data#kingdoms
		* @description Root Group instance that forms all of the hierarchy
		* @propertyOf species.service:Data
		*/
		this.kingdoms = null;
		
		/**
		* @ngdoc method
		* @name species.service:Data#Import
		* @description Attempts to import an excel file, will provide dummy data if failed
		* @methodOf species.service:Data
		* @param {object} tExcel Excel file to import
		* @param {object} tCallback Callback function for success
		* @param {object} tCallbackContext Callback function context
		*/
		this.Import = function( tExcel, tCallback, tCallbackContext )
		{
			var tempOnImport = function( tKingdoms )
			{
				this.kingdoms = tKingdoms;
				
				// Callback
				if ( tCallback != null )
				{
					tCallback.call( tCallbackContext );
				}
			};
			
			Excel.Import( tExcel, tempOnImport, this );
		};
		
		/**
		* @ngdoc method
		* @name species.service:Data#Export
		* @description Attempts to export an excel file
		* @methodOf species.service:Data
		*/
		this.Export = function( tFileName )
		{
			Excel.Export( this.kingdoms, tFileName );
		};
		
		/**
		* @ngdoc method
		* @name species.service:Data#Populate
		* @description Populates dummy data if no data already set
		* @methodOf species.service:Data
		*/
		this.Populate = function()
		{
			if ( this.kingdoms == null )
			{
				this.kingdoms = new Group( "Kingdoms" );
				
				var tempAnimalia = new Group( "Animalia" );
				this.kingdoms.addChild( tempAnimalia );
				
				var tempChordata = new Group( "Chordata" );
				tempAnimalia.addChild( tempChordata );
				var tempArthropod = new Group( "Arthropod" );
				tempAnimalia.addChild( tempArthropod );
				
				var tempMammalia = new Group( "Mammalia" );
				tempChordata.addChild( tempMammalia );
				var tempActinopterygii = new Group( "Actinopterygii" );
				tempChordata.addChild( tempActinopterygii );
				var tempInsecta = new Group( "Insecta" );
				tempArthropod.addChild( tempInsecta );
				
				var tempRodentia = new Group( "Rodentia" );
				tempMammalia.addChild( tempRodentia );
				var tempSiluriformes = new Group( "Siluriformes" );
				tempActinopterygii.addChild( tempSiluriformes );
				var tempHymenoptera = new Group( "Hymenoptera" );
				tempInsecta.addChild( tempHymenoptera );
				
				var tempSciuridae = new Group( "Sciuridae" );
				tempRodentia.addChild( tempSciuridae );
				var tempCricetidae = new Group( "Cricetidae" );
				tempRodentia.addChild( tempCricetidae );
				var tempIctaluridae = new Group( "Ictaluridae" );
				tempSiluriformes.addChild( tempIctaluridae );
				var tempFormicidae = new Group( "Formicidae" );
				tempHymenoptera.addChild( tempFormicidae );
				
				tempSciuridae.addChild( new Species( "Otospermophilus beecheyi", "California ground squirrel", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/California_ground_squirrel_at_Point_Lobos.jpg/800px-California_ground_squirrel_at_Point_Lobos.jpg" ) );
				tempCricetidae.addChild( new Species( "Ondatra zibethicus", "Muskrat", "https://upload.wikimedia.org/wikipedia/commons/8/83/Muskrat_Foraging.JPG" ) );
				tempIctaluridae.addChild( new Species( "Ictalurus punctatus", "Channel catfish", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ictalurus_punctatus3.jpg/1920px-Ictalurus_punctatus3.jpg" ) );
				tempFormicidae.addChild( new Species( "Solenopsis geminata", "Fire ant", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/CSIRO_ScienceImage_11133_Tropical_fire_ant.jpg/1280px-CSIRO_ScienceImage_11133_Tropical_fire_ant.jpg" ) );
			}
		};
	}
] );