angular.module('SearchSwitch')

.factory( 'Search', function( LogService ){
  return (function(){
    function Search ( properties ){
      this.properties = properties;
    }

    Search.prototype.checkUrl = function( url ){
      var regex = new RegExp( "http(?:s)?:\/\/" + this.properties.url, "g" );

      if ( url.match( regex ) !== null ){
          return true;
        }

        return false;
    };

    Search.prototype.getQueryValue = function( url ){
      LogService.output( "Getting query value of " + url );

      var query = url.match( that.queryStringRegex );

      LogService.output( "Query value - " + query );

      if ( query && query.length > 0 ){
        query = query[ query.length - 1 ];

        query = query.split('=')[1];

        //Converting it to a regular string
        query = decodeURIComponent( query );

        query = query.replace( /\+/g, ' ');
      }

      if ( query ){
        return query;
      }

      return false;
    };

    Search.prototype.getQuery = function( queryString ){
      queryString = this.properties.encodingFunction( queryString );

      return "http://" + this.properties.url + "/" + this.properties.resultsPage + this.properties.queryVariable + "=" + queryString;
    };

    Search.prototype.getSubSearches = function(){
      return subSearches;
    };

    Search.prototype.getJSON = function( page ){
      var returnObj = {
        name: this.properties.name,
        url: this.properties.getQuery( page.query ),
        currentSearch: (page.selectedSearch === that),
        subSearches: []
      };

      if ( subSearches.length > 0 ){
        for ( var i = 0; i < subSearches.length; i++ ){
          returnObj.subSearches.push( subSearches[i].getJSON( page ) );
        }
      }

      return returnObj;
    };

    return Search;

  })();
});