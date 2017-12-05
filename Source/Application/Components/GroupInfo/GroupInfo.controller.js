/**
* @ngdoc controller
* @name species.controller:GroupInfo
* @description Controller for displaying a Group block
* @requires species.service:Group
* @requires species.service:Species
*/
angular.module( "species" ).controller( "GroupInfo", [ "Group", "Species",
	function( Group, Species )
	{
		/**
		* @ngdoc property
		* @name species.controller:GroupInfo#isExpanded
		* @description Toggles hierarchy visibility
		* @propertyOf species.controller:GroupInfo
		* @returns {boolean}
		*/
		this.isExpanded = false;
		
		/**
		* @ngdoc method
		* @name species.controller:GroupInfo#$onInit
		* @description Instantiates expanded state
		* @methodOf species.controller:GroupInfo
		*/
		this.$onInit = function()
		{
			this.isExpanded = true;
		};
		
		/**
		* @ngdoc method
		* @name species.controller:GroupInfo#onCreate
		* @description Adds either a Species or Group instance to the primary model instance depending on depth
		* @methodOf species.controller:GroupInfo
		*/
		this.onCreate = function()
		{
			this.model.addChild( this.depth >= 4 ? new Species( "New Species" ) : new Group( "New Group" ) );
		};
	}
] );
