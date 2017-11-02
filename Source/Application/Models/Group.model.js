/**
* @ngdoc service
* @name species.service:Group
* @description Model class for Group
*/
angular.module( "species" ).factory( "Group", [
	function()
	{
		/**
		* @ngdoc method
		* @name species.service:Group#Group
		* @description Constructor
		* @methodOf species.service:Group
		* @param {string} tName Name of the Group
		*/
		function Group( tName )
		{
			this.name = tName;
			this.children = null;
		};
		
		/**
		* @ngdoc method
		* @name species.service:Group#addChild
		* @description Adds a child to the group
		* @methodOf species.service:Group
		* @param {object} tChild Child to add
		* @returns True if successful
		*/
		Group.prototype.addChild = function( tChild )
		{
			if ( this.children == null )
			{
				this.children = [];
			}
			this.children.unshift( tChild );
			
			return true;
		};
		
		/**
		* @ngdoc method
		* @name species.service:Group#removeChild
		* @description Remove a child from the group
		* @methodOf species.service:Group
		* @param {int} tIndex Index of child to remove
		* @returns True if successful
		*/
		Group.prototype.removeChild = function( tIndex )
		{
			if ( tIndex >= 0 && this.children != null && tIndex < this.children.length )
			{
				this.children.splice( tIndex, 1 );
				if ( this.children.length == 0 )
				{
					delete this.children;
				}
				
				return true;
			}
			
			return false;
		};
		
		/**
		* @ngdoc method
		* @name species.service:Group#moveChild
		* @description Move a child up or down in a group
		* @methodOf species.service:Group
		* @param {int} tIndex Index of child to move
		* @param {bool} tIsUp Direction to move in children list
		* @returns True if successful
		*/
		Group.prototype.moveChild = function( tIndex, tIsUp )
		{
			tToIndex = tIsUp ? tIndex - 1 : tIndex + 1;
			if ( tIndex != tToIndex && tIndex >= 0 && tToIndex >= 0 && this.children != null )
			{
				var tempListLength = this.children.length;
				if ( tIndex < tempListLength && tToIndex < tempListLength )
				{
					var tempFrom = this.children[ tIndex ];
					this.children[ tIndex ] = this.children[ tToIndex ];
					this.children[ tToIndex ] = tempFrom;
					
					return true;
				}
			}
			
			return false;
		};
		
		return Group;
	}
] );