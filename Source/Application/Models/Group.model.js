angular.module( "species" ).factory( "Group", [
	function()
	{
		function Group( tName )
		{
			this.name = tName;
			this.children = null;
		};
		
		Group.prototype.addChild = function( tChild )
		{
			if ( this.children == null )
			{
				this.children = [];
			}
			this.children.unshift( tChild );
			
			return true;
		};
		
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