angular.module( "species" ).service( "Excel", [
	function()
	{
		this.Import = function( tExcel, tParent, tCallback, tCallbackContext )
		{
			var tempThis = this;
			var tempReader = new FileReader();
			tempReader.onload = function()
			{
				// Convert workbook into JS
				var tempWorkbook = XLSX.read( tempReader.result, { type: "binary" } );
				
				// Process Templates
				var tempTemplates = null;
				for ( var i = ( tempWorkbook.SheetNames.length - 1 ); i > 0; --i )
				{
					if ( tempTemplates == null )
					{
						tempTemplates = {};
					}
					tempTemplates[ tempWorkbook.SheetNames[i] ] = tempThis.ReadTemplate( tempWorkbook.SheetNames[i], XLSX.utils.sheet_to_json( tempWorkbook.Sheets[ tempWorkbook.SheetNames[i] ], { header: 1 } ) );
				}
				
				// Process Unit Info, assumed to be first sheet
				tempThis.ReadUnitInfo( tParent, tempTemplates, XLSX.utils.sheet_to_json( tempWorkbook.Sheets[ tempWorkbook.SheetNames[0] ], { header: 1 } ) );
				
				// Callback
				if ( tCallback != null )
				{
					tCallback.call( tCallbackContext );
				}
			};
			
			tempReader.readAsBinaryString( tExcel );
		};
		
		this.ReadTemplate = function( tName, tRows )
		{
			if ( tRows != null )
			{				
				// Generate units and add to KVP
				var tempKVPUnits = null;
				var tempUnit = null;
				var tempListLength = tRows.length;
				for ( var i = 0; i < tempListLength; ++i )
				{
					if ( tRows[i][0] == "U" ) // first column assumed type
					{
						var tempIterator = { index: i };
						tempUnit = this.ReadTemplateUnit( tRows[i], tRows, tempIterator ); // iterator let's the template unit to skip through this for loop to avoid processing non-units
						i = tempIterator.index;
						
						if ( tempUnit != null )
						{
							if ( tempKVPUnits == null )
							{
								tempKVPUnits = {};
							}
							tempKVPUnits[ tempUnit.name ] = tempUnit;
						}
					}
				}
				
				// Parent units together via KVP
				var tempTemplate = { name: tName };
				
				if ( tempKVPUnits != null )
				{
					for ( var tempKey in tempKVPUnits )
					{
						tempUnit = tempKVPUnits[ tempKey ];
						tempUnit.parent = tempUnit.parent == null ? tempTemplate : tempKVPUnits[ tempUnit.parent ]; // null assumes top level of template
						
						if ( tempUnit.parent != null )
						{
							if ( tempUnit.parent.children == null )
							{
								tempUnit.parent.children = [];
								tempUnit.parent.isExpandable = true;
							}
							tempUnit.parent.children.push( tempUnit );
						}
					}
				}
				
				return tempTemplate;
			}
			
			return null;
		};
		
		this.ReadTemplateUnit = function( tUnitRow, tRows, tIterator )
		{
			if ( tUnitRow[0] != null && tUnitRow[1] != null ) // column order is assumed
			{
				// Create unit
				var tempUnit = {};
				tempUnit.type = tUnitRow[0];
				tempUnit.name = tUnitRow[1];
				tempUnit.parent = ( tUnitRow[2] == "" || tUnitRow[2] == "TOP" ) ? null : tUnitRow[2];
				tempUnit.echelon = tUnitRow[4]; // 3rd column is skipped
				tempUnit.unitClass = tUnitRow[5];
				tempUnit.charlie = tUnitRow[6];
				
				if ( tempUnit.charlie != null )
				{
					tempUnit.icon = armyc2.c2sd.renderer.MilStdSVGRenderer.Render( tempUnit.charlie ).getSVGDataURI();
				}
				
				// Generate equipment
				var tempListLength = tRows.length;
				for ( var i = ( tIterator.index + 1 ); i < tempListLength; ++i )
				{
					if ( tRows[i][0] == "E" || tRows[i][0] == "W" ) // tow wagon structured same as equipment
					{
						tIterator.index = i;
						var tempEquipment = this.ReadTemplateEquipment( tRows[i], tRows, tIterator );
						i = tIterator.index;
						
						if ( tempEquipment != null )
						{
							if ( tempUnit.equipment == null )
							{
								tempUnit.equipment = [];
								tempUnit.isExpandable = true;
							}
							tempUnit.equipment.push( tempEquipment );
						}
					}
					else
					{
						tIterator.index = i - 1;
						break;
					}
				}
				
				return tempUnit;
			}
			
			return null;
		};
		
		this.ReadTemplateEquipment = function( tEquipmentRow, tRows, tIterator )
		{
			if ( tEquipmentRow[3] != null ) // column order is assumed
			{
				// Create equipment
				var tempEquipment = {};
				tempEquipment.type = tEquipmentRow[0];
				tempEquipment.name = tEquipmentRow[3];
				tempEquipment.echelon = tEquipmentRow[4];
				tempEquipment.unitClass = tEquipmentRow[5];
				
				// Generate personnel
				var tempListLength = tRows.length;
				for ( var i = ( tIterator.index + 1 ); i < tempListLength; ++i )
				{
					if ( tRows[i][0] == "P" )
					{
						tIterator.index = i;
						var tempPersonnel = this.ReadTemplatePersonnel( tRows[i] );
						i = tIterator.index;
						
						if ( tempPersonnel != null )
						{
							if ( tempEquipment.personnel == null )
							{
								tempEquipment.personnel = [];
								tempEquipment.isExpandable = true;
							}
							tempEquipment.personnel.push( tempPersonnel );
						}
					}
					else
					{
						tIterator.index = i - 1;
						break;
					}
				}
				
				return tempEquipment;
			}
			
			return null;
		};
		
		this.ReadTemplatePersonnel = function( tPersonnelRow )
		{
			var tempPersonnel = {}; // column order is assumed
			tempPersonnel.type = tPersonnelRow[0];
			tempPersonnel.name = tPersonnelRow[3];
			tempPersonnel.weapon = tPersonnelRow[4];
			
			return tempPersonnel;
		};
		
		this.ReadUnitInfo = function( tParent, tTemplates, tRows )
		{
			if ( tRows != null )
			{
				// Add to KVP if units have a name
				var tempKVPUnits = null;
				var tempUnit = null;
				var tempListLength = tRows.length;
				for ( var i = 1; i < tempListLength; ++i ) // skips first row/assumed header
				{
					tempUnit = this.ReadUnitInfoUnit( tRows[i], tTemplates );
					
					if ( tempUnit != null )
					{
						if ( tempKVPUnits == null )
						{
							tempKVPUnits = {};
						}
						tempKVPUnits[ tempUnit.name ] = tempUnit;
					}
				}
				
				// Parent units together via KVP
				if ( tempKVPUnits != null )
				{
					for ( var tempKey in tempKVPUnits )
					{
						tempUnit = tempKVPUnits[ tempKey ];
						tempUnit.parent = tempUnit.parent == null ? tParent : tempKVPUnits[ tempUnit.parent ]; // null assumes top level
						
						if ( tempUnit.parent != null )
						{
							if ( tempUnit.parent.children == null )
							{
								tempUnit.parent.children = [];
								tempUnit.parent.isExpandable = true;
							}
							tempUnit.parent.children.push( tempUnit );
						}
					}
				}
			}
		};
		
		this.ReadUnitInfoUnit = function( tUnitRow, tTemplates )
		{
			if ( tUnitRow[0] != null && tUnitRow[1] != null ) // column order is assumed
			{
				// Create unit
				var tempUnit = {};
				tempUnit.type = tUnitRow[0];
				tempUnit.name = tUnitRow[1];
				tempUnit.parent = ( tUnitRow[2] == "" || tUnitRow[2] == "TOP" ) ? null : tUnitRow[2];
				tempUnit.uic = tUnitRow[3];
				tempUnit.echelon = tUnitRow[4];
				tempUnit.unitClass = tUnitRow[5];
				
				if ( tTemplates != null && tUnitRow[6] != null )
				{
					tempUnit.template = tTemplates[ tUnitRow[6] ];
					if ( tempUnit.template == null )
					{
						console.log( "TEMPLATE NOT FOUND: " + tUnitRow[6] );
					}
					else
					{
						tempUnit.isExpandable = true;
					}
				}

				tempUnit.charlie = tUnitRow[7];
				if ( tempUnit.charlie != null )
				{
					tempUnit.icon = armyc2.c2sd.renderer.MilStdSVGRenderer.Render( tempUnit.charlie ).getSVGDataURI();
				}
				
				return tempUnit;
			}
			
			return null;
		};
		
		this.WriteUnitInfoSheet = function( tSheet, tTemplates, tParent, tUnit )
		{
			if ( tSheet != null && tUnit != null )
			{
				// Store unit data as array
				var tempUnitArray = []; // indices match header row
				tempUnitArray[0] = tUnit.type;
				tempUnitArray[1] = tUnit.name;
				tempUnitArray[2] = tUnit.parent == null ? "" : ( tUnit.parent == tParent ? "TOP" : tUnit.parent.name );
				tempUnitArray[3] = tUnit.uic;
				tempUnitArray[4] = tUnit.echelon;
				tempUnitArray[5] = tUnit.unitClass;
				
				if ( tUnit.template != null )
				{
					tTemplates[ tUnit.template.name ] = tUnit.template; // stores first occurence of used template
				}
				
				tempUnitArray[6] = tUnit.template == null ? "" : tUnit.template.name;
				tempUnitArray[7] = tUnit.charlie;
				
				tSheet.push( tempUnitArray );
				
				// Recurse through children
				if ( tUnit.children != null )
				{
					var tempListLength = tUnit.children.length;
					for ( var i = 0; i < tempListLength; ++i )
					{
						this.WriteUnitInfoSheet( tSheet, tTemplates, tParent, tUnit.children[i] );
					}
				}
			}
		};

		this.WriteTemplateSheetUnit = function( tSheet, tTemplate, tUnit, tCounter )
		{
			// Store unit data as array
			var tempUnitArray = []; // indices match header row
			tempUnitArray[0] = tUnit.type;
			tempUnitArray[1] = tUnit.name;
			tempUnitArray[2] = tUnit.parent == null ? "" : ( tUnit.parent == tTemplate ? "TOP" : tUnit.parent.name );
			tempUnitArray[3] = "";
			tempUnitArray[4] = tUnit.echelon;
			tempUnitArray[5] = tUnit.unitClass;
			tempUnitArray[6] = tUnit.charlie;
			
			tSheet.push( tempUnitArray );
			
			// Store equipment
			if ( tUnit.equipment != null )
			{
				var tempListLength = tUnit.equipment.length;
				for ( var i = 0; i < tempListLength; ++i )
				{
					this.WriteTemplateSheetEquipment( tSheet, tUnit, tUnit.equipment[i], tCounter );
				}
			}
			
			// Recurse through children
			if ( tUnit.children != null )
			{
				var tempListLength = tUnit.children.length;
				for ( var i = 0; i < tempListLength; ++i )
				{
					this.WriteTemplateSheetUnit( tSheet, tTemplate, tUnit.children[i], tCounter );
				}
			}
		};
		
		this.WriteTemplateSheetEquipment = function( tSheet, tUnit, tEquipment, tCounter )
		{
			// Store equipment data as array
			var tempEquipmentArray = []; // indices match header row
			tempEquipmentArray[0] = tEquipment.type;
			tempEquipmentArray[1] = tCounter.index;
			tempEquipmentArray[2] = tUnit.name;
			tempEquipmentArray[3] = tEquipment.name;
			tempEquipmentArray[4] = tEquipment.echelon;
			tempEquipmentArray[5] = tEquipment.unitClass;
			
			tSheet.push( tempEquipmentArray );
			
			++tCounter.index;
			
			// Store personnel
			if ( tEquipment.personnel != null )
			{
				var tempListLength = tEquipment.personnel.length;
				for ( var i = 0; i < tempListLength; ++i )
				{
					this.WriteTemplateSheetPersonnel( tSheet, tEquipment.personnel[i], tempEquipmentArray[1], tCounter );
				}
			}
		};
		
		this.WriteTemplateSheetPersonnel = function( tSheet, tPersonnel, tEquipmentIndex, tCounter )
		{
			// Store personnel data as array
			var tempPersonnelArray = []; // indices match header row
			tempPersonnelArray[0] = tPersonnel.type;
			tempPersonnelArray[1] = tCounter.index;
			tempPersonnelArray[2] = tEquipmentIndex;
			tempPersonnelArray[3] = tPersonnel.name;
			tempPersonnelArray[4] = tPersonnel.weapon;
			
			tSheet.push( tempPersonnelArray );
			
			++tCounter.index;
		};
		
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
		
		this.Export = function( tParent, tUnit )
		{
			if ( tUnit != null )
			{
				// Generate Unit Info sheet
				var tempSheet = [ [ "TYPE", "NAME", "PARENT", "UIC", "ECHELON", "UNIT CLASS", "TEMPLATE", "2525C" ] ]; // injecting header row
				var tempTemplates = {};
				this.WriteUnitInfoSheet( tempSheet, tempTemplates, tParent, tUnit );
				
				var tempSheetNames = [ "UNIT INFO" ];
				var tempSheets = { "UNIT INFO": XLSX.utils.aoa_to_sheet( tempSheet ) };
				
				// Generate Templates
				var tempTemplate = null;
				for ( var tempKey in tempTemplates )
				{
					tempSheet = [];
					
					var tempIterator = { index: 1 };
					tempTemplate = tempTemplates[ tempKey ];
					if ( tempTemplate.children != null )
					{
						var tempListLength = tempTemplate.children.length;
						for ( var i = 0; i < tempListLength; ++i )
						{
							this.WriteTemplateSheetUnit( tempSheet, tempTemplate, tempTemplate.children[i], tempIterator );
						}
					}
					
					tempSheetNames.push( tempKey );
					tempSheets[ tempKey ] = XLSX.utils.aoa_to_sheet( tempSheet );
				}
				
				// Save
				saveAs( new Blob( [ this.StringToBuffer( XLSX.write( { SheetNames: tempSheetNames, Sheets: tempSheets }, { bookType: "xlsx", bookSST: true, type: "binary" } ) ) ], { type: "application/octet-stream" } ), tUnit.name + ".xlsx" );
			}
		};
	}
] );