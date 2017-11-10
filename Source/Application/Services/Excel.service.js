/**
* @ngdoc service
* @name species.service:Excel
* @description Processor for importing and exporting excel files
* @requires species.function:Group
* @requires species.function:Species
*/
angular.module( "species" ).service( "Excel", [ "Group", "Species", 
	function( Group, Species )
	{
		/**
		* @ngdoc method
		* @name species.service:Excel#Import
		* @description Reads in an excel file and generates a hierarchy object
		* @methodOf species.service:Excel
		* @param {object} tExcel Raw excel file
		* @param {object} tCallback Callback function
		* @param {object} tCallbackContext Callback function context
		*/
		this.Import = function( tExcel, tCallback, tCallbackContext )
		{
			var tempThis = this;
			var tempReader = new FileReader();
			tempReader.onload = function()
			{
				// Convert workbook into JS
				var tempWorkbook = XLSX.read( tempReader.result, { type: "binary" } );
				
				// Store and convert sheet rows into KVP
				var tempBindTables = {};
				var tempSpeciesTable = null;
				var tempRows = null;
				var tempTableName = null;
				for ( var i = ( tempWorkbook.SheetNames.length - 1 ); i >= 0; --i )
				{
					tempTableName = tempWorkbook.SheetNames[i];
					tempRows = XLSX.utils.sheet_to_json( tempWorkbook.Sheets[ tempTableName ] );
					
					if ( tempTableName == "Species" )
					{
						tempSpeciesTable = tempRows;
					}
					else
					{
						var tempKVP = {};
						var tempListLength = tempRows.length;
						for ( var j = 0; j < tempListLength; ++j )
						{
							tempKVP[ tempRows[j].Name ] = tempRows[j];
						}
						
						tempBindTables[ tempTableName ] = tempKVP;
					}
				}
				
				// Process hierarchy
				var tempKingdoms = null;
				var tempKingdomTable = tempBindTables[ "Kingdom" ];
				if ( tempKingdomTable != null )
				{
					tempKingdoms = new Group( "Kingdoms" );
					for ( var tempName in tempKingdomTable )
					{
						tempKingdomTable[ tempName ] = new Group( tempName );
						tempKingdoms.addChild( tempKingdomTable[ tempName ] );
					}
					
					var tempPhylumTable = tempBindTables[ "Phylum" ];
					if ( tempPhylumTable != null )
					{
						tempThis.ReadGroupTable( tempPhylumTable, tempKingdomTable, "Kingdom" );
						
						var tempClassTable = tempBindTables[ "Class" ];
						if ( tempClassTable != null )
						{
							tempThis.ReadGroupTable( tempClassTable, tempPhylumTable, "Phylum" );
							
							var tempOrderTable = tempBindTables[ "Order" ];
							if ( tempOrderTable != null )
							{
								tempThis.ReadGroupTable( tempOrderTable, tempClassTable, "Class" );
								
								var tempFamilyTable = tempBindTables[ "Family" ];
								if ( tempFamilyTable != null )
								{
									tempThis.ReadGroupTable( tempFamilyTable, tempOrderTable, "Order" );
									
									if ( tempSpeciesTable != null )
									{
										tempThis.ReadSpeciesTable( tempSpeciesTable, tempFamilyTable );
									}
								}
							}
						}
					}
				}
				
				// Callback
				tCallback.call( tCallbackContext, tempKingdoms );
			};
			
			tempReader.readAsBinaryString( tExcel );
		};
		
		/**
		* @ngdoc method
		* @name species.service:Excel#ReadGroupTable
		* @description Converts a group table entry into a Group instance and binds it to a parent instance
		* @methodOf species.service:Excel
		* @param {object} tChildTable Child Group table associative array
		* @param {object} tParentTable Parent Group table associative array
		* @param {string} tParentName Name of parent
		*/
		this.ReadGroupTable = function( tChildTable, tParentTable, tParentName )
		{
			var tempGroup = null;
			var tempParent = null;
			for ( var tempName in tChildTable )
			{
				tempGroup = new Group( tempName );
				tempParent = tParentTable[ tChildTable[ tempName ][ tParentName ] ];
				if ( tempParent != null )
				{
					tempParent.addChild( tempGroup );
				}
				
				tChildTable[ tempName ] = tempGroup;
			}
		};
		
		/**
		* @ngdoc method
		* @name species.service:Excel#ReadSpeciesTable
		* @description Converts a species table entry into a Species instance and binds it to a parent instance
		* @methodOf species.service:Excel
		* @param {object} tSpeciesTable Species table row array
		* @param {object} tParentTable Parent Group table associative array
		*/
		this.ReadSpeciesTable = function( tSpeciesTable, tParentTable )
		{
			var tempRow = null;
			var tempSpecies = null;
			var tempParent = null;
			var tempListLength = tSpeciesTable.length;
			for ( var i = 0; i < tempListLength; ++i )
			{
				tempRow = tSpeciesTable[i];
				tempSpecies = new Species( tempRow.Name, tempRow[ "Common Name" ], tempRow.Image );
				tempParent = tParentTable[ tempRow.Family ];
				if ( tempParent != null )
				{
					tempParent.addChild( tempSpecies );
				}
			}
		};
		
		/**
		* @ngdoc method
		* @name species.service:Excel#Export
		* @description Exports an excel file using an input Group
		* @methodOf species.service:Excel
		* @param {object} tKingdoms Input Group representing Kingdoms
		* @param {object} tFileName Name of export file
		*/
		this.Export = function( tKingdoms, tFileName )
		{
			if ( tKingdoms != null && tKingdoms.children != null )
			{
				// Generate sheets
				var tempSheets = [];
				tempSheets.push( [ [ "Name" ] ] );
				tempSheets.push( [ [ "Name", "Kingdom" ] ] );
				tempSheets.push( [ [ "Name", "Phylum" ] ] );
				tempSheets.push( [ [ "Name", "Class" ] ] );
				tempSheets.push( [ [ "Name", "Order" ] ] );
				tempSheets.push( [ [ "Name", "Common Name", "Family", "Image" ] ] );
				
				// Write hierarchy
				this.WriteGroupSheet( tempSheets, 0, tKingdoms );
				
				tempSheetNames = [ "Kingdom", "Phylum", "Class", "Order", "Family", "Species" ];
				
				tempSheetsKVP = {};
				tempSheetsKVP[ "Kingdom" ] = XLSX.utils.aoa_to_sheet( tempSheets[0] );
				tempSheetsKVP[ "Phylum" ] = XLSX.utils.aoa_to_sheet( tempSheets[1] );
				tempSheetsKVP[ "Class" ] = XLSX.utils.aoa_to_sheet( tempSheets[2] );
				tempSheetsKVP[ "Order" ] = XLSX.utils.aoa_to_sheet( tempSheets[3] );
				tempSheetsKVP[ "Family" ] = XLSX.utils.aoa_to_sheet( tempSheets[4] );
				tempSheetsKVP[ "Species" ] = XLSX.utils.aoa_to_sheet( tempSheets[5] );
				
				// Save
				saveAs( new Blob( [ this.StringToBuffer( XLSX.write( { SheetNames: tempSheetNames, Sheets: tempSheetsKVP }, { bookType: "xlsx", bookSST: true, type: "binary" } ) ) ], { type: "application/octet-stream" } ), tFileName + ".xlsx" );
			}
		};
		
		/**
		* @ngdoc method
		* @name species.service:Excel#WriteGroupSheet
		* @description Writes an excel sheet of either a kingdom type, generic classification group type, or species type depending on the depth
		* @methodOf species.service:Excel
		* @param {object} tSheets Input sheets array with each element corresponding to depth
		* @param {int} tDepth Depth of the hierarchy used to determine type of sheet to write
		* @param {object} tGroup Group model
		*/
		this.WriteGroupSheet = function( tSheets, tDepth, tGroup )
		{
			if ( tGroup.children != null )
			{
				var tempChild = null;
				var tempListLength = tGroup.children.length;
				switch ( tDepth )
				{
					case 0: // kingdom
						for ( var i = 0; i < tempListLength; ++i )
						{
							tempChild = tGroup.children[i];
							tSheets[0].push( [ tempChild.name ] );
							this.WriteGroupSheet( tSheets, 1, tempChild );
						}
						break;
					case 5: // species
						for ( var i = 0; i < tempListLength; ++i )
						{
							tempChild = tGroup.children[i];
							tSheets[ tDepth ].push( [ tempChild.name, tempChild.commonName, tGroup.name, tempChild.image ] );
						}
						break;
					default: // groups
						for ( var i = 0; i < tempListLength; ++i )
						{
							tempChild = tGroup.children[i];
							tSheets[ tDepth ].push( [ tempChild.name, tGroup.name ] );
							this.WriteGroupSheet( tSheets, tDepth + 1, tempChild );
						}
						break;
				}
			}
		};
		
		/**
		* @ngdoc method
		* @name species.service:Excel#StringToBuffer
		* @description Converts string to binary buffer
		* @methodOf species.service:Excel
		* @param {string} tString String to convert
		* @returns {object} Converted ArrayBuffer
		*/
		this.StringToBuffer = function( tString )
		{
			// Convert string to proper byte format so it can be exported
			var tempBuffer = new ArrayBuffer( tString.length );
			var tempArray = new Uint8Array( tempBuffer );
			for ( var i = ( tempArray.length - 1 ); i >= 0; --i )
			{
				tempArray[i] = tString.charCodeAt( i ) & 0xFF;
			}
			
			return tempBuffer;
		};
	}
] );