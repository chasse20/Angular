/**
* @ngdoc service
* @name species.service:Data
* @description Singleton for data
* @requires species.service:Excel
*/
angular.module( "species" ).service( "Data", [ "Excel",
	function( Excel )
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
		* @param {object} tScope Scope of callback
		*/
		this.Import = function( tExcel, tScope )
		{
			var tempOnImport = function( tKingdoms )
			{
				this.kingdoms = tKingdoms;
				tScope.$apply();
			};
			
			Excel.Import( tExcel, tempOnImport, this );
		};
		
		/**
		* @ngdoc method
		* @name species.service:Data#Export
		* @description Attempts to export an excel file
		* @methodOf species.service:Data
		*/
		this.Export = function()
		{
			Excel.Export( this.kingdoms, "Species" );
		};
	}
] );