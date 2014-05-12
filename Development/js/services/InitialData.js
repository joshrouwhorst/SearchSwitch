angular.module('SearchSwitch')

.factory('InitialDataService', function( LogService ){
  var encodings = {
        standard: encodeURIComponent,
        pluses: function( query ){
          query = query.replace( / /g, '+' );
          query = encodeURI( query );

          return query;
        }
      };

  var searches = [
    {
      name: "Google",
      url: "www.google.com",
      queryVariable: "q",
      resultsPage: '#',
      encodingFunction: encodings.standard,
      view: true,
      subSearches: [
        {
          name: 'Images',
          url: 'www.google.com',
          queryVariable: 'q',
          resultsPage: '#',
          encodingFunction: encodings.standard,
          getQuery: function( queryString ){
            queryString = this.encodingFunction( queryString );

            return "http://" + this.url + "/" + this.resultsPage + this.queryVariable + "=" + queryString + "&tbm=isch";
          }
        },
        {
          name: 'Videos',
          url: 'www.google.com',
          queryVariable: 'q',
          resultsPage: '#',
          encodingFunction: encodings.standard,
          getQuery: function( queryString ){
            queryString = this.encodingFunction( queryString );

            return "http://" + this.url + "/" + this.resultsPage + this.queryVariable + "=" + queryString + "&tbm=vid";
          }
        }
      ]
    },
    {
      name: "YouTube",
      url: "www.youtube.com",
      queryVariable: 'search_query',
      resultsPage: 'results?',
      view: true,
      encodingFunction: encodings.standard
    },
    {
      name: 'Wikipedia',
      url: 'wikipedia.org',
      resultsPage: 'wiki/',
      view: true,
      encodingFunction: function( query ){
        query = query.replace( / /g, '_');
        query = encodeURIComponent( query );

        return query;
      },
      checkUrl: function( url ){
        var regex = new RegExp( "http(?:s)?:\/\/([^?]*)" + this.url, "g" );

        if ( url.match( regex ) !== null ){
          return true;
        }

        return false;
      },
      getQueryValue: function( url ){
        LogService.output( "Getting query value of " + url );

        var query = url.match( /wiki\/([^?]+)/g );

        LogService.output( "Query value - " + query );

        if ( query && query.length > 0 ){
          query = query[ query.length - 1 ];

          query = query.split('wiki/')[1];

          //Converting it to a regular string
          query = decodeURIComponent( query );

          query = query.replace( /_/g, ' ');
        }

        if ( query ){
          return query;
        }

        return false;
      },
      getQuery: function( queryString ){
        queryString = this.encodingFunction( queryString );

        return "http://" + this.url + "/" + this.resultsPage + queryString;
      }
    },
    {
      name: "Yahoo!",
      url: "search.yahoo.com",
      queryVariable: "p",
      resultsPage: "search?",
      view: true,
      encodingFunction: encodings.pluses
    },
    {
      name: "Bing",
      url: "www.bing.com",
      queryVariable: 'q',
      resultsPage: 'search?',
      view: true,
      encodingFunction: encodings.pluses,
      subSearches: [
        {
          name: "Images",
          url: "www.bing.com",
          queryVariable: 'q',
          resultsPage: 'images/search?',
          view: true,
          encodingFunction: encodings.pluses
        },
        {
          name: "Videos",
          url: "www.bing.com",
          queryVariable: 'q',
          resultsPage: 'videos/search?',
          view: true,
          encodingFunction: encodings.pluses
        }
      ]
    }
  ];

  return {
    searches: searches
  };
});