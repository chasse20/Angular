/**
* @ngdoc service
* @name species.service:Species
* @description Model class for Species
*/
angular.module( "species" ).factory( "Species", [
	function()
	{
		/**
		* @ngdoc property
		* @name species.service:Species#name
		* @description Name of the Species
		* @propertyOf species.service:Species
		* @returns {string}
		*/
		this.name = null;
		
		/**
		* @ngdoc property
		* @name species.service:Species#commonName
		* @description Common Name of the Species
		* @propertyOf species.service:Species
		* @returns {string}
		*/
		this.commonName = null;
		
		/**
		* @ngdoc property
		* @name species.service:Species#image
		* @description Image URL of the Species
		* @propertyOf species.service:Species
		* @returns {string}
		*/
		this.image = null;
		
		/**
		* @ngdoc method
		* @name species.service:Species#Species
		* @description Constructor
		* @methodOf species.service:Species
		* @param {string} tName Name of the Species
		* @param {string} tCommonName Common Name of the Species
		* @param {string} tImage Image URL of the Species
		*/
		function Species( tName, tCommonName, tImage )
		{
			this.name = tName;
			this.commonName = tCommonName;
			this.image = tImage;
		};
		
		return Species;
	}
] );
