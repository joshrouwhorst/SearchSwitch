var SearchExtension = {
  encodings: {}
};

SearchExtension.encodings.pluses = function( query ){
  query = query.replace( / /g, '+' );
  query = encodeURI( query );

  return query;
};

SearchExtension.encodings.standard = encodeURIComponent;

SearchExtension.searchConfigs = [
  {
    name: "Google",
    url: "www.google.com",
    queryVariable: "q",
    resultsPage: '#',
    encodingFunction: SearchExtension.encodings.standard
  },
  {
    name: "YouTube",
    url: "www.youtube.com",
    queryVariable: 'search_query',
    resultsPage: 'results?',
    encodingFunction: SearchExtension.encodings.standard
  },
  {
    name: 'Wikipedia',
    url: 'wikipedia.org',
    resultsPage: 'wiki/',
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
      SearchExtension.log( "Getting query value of " + url );

      var query = url.match( /wiki\/([^?]+)/g );

      SearchExtension.log( "Query value - " + query );

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
    encodingFunction: SearchExtension.encodings.pluses
  },
  {
    name: "Bing",
    url: "www.bing.com",
    queryVariable: 'q',
    resultsPage: 'search?',
    encodingFunction: SearchExtension.encodings.pluses
  }
];

SearchExtension.searches = [];

SearchExtension.Search = function( opts ){
  var that = this;

  that.checkUrl = function( url ){
    var regex = new RegExp( "http(?:s)?:\/\/" + that.url, "g" );

    if ( url.match( regex ) !== null ){
        return true;
      }

      return false;
  };

  that.getQueryValue = function( url ){
    SearchExtension.log( "Getting query value of " + url );

    var query = url.match( that.queryStringRegex );

    SearchExtension.log( "Query value - " + query );

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

  that.getQuery = function( queryString ){
    queryString = that.encodingFunction( queryString );

    return "http://" + that.url + "/" + that.resultsPage + that.queryVariable + "=" + queryString;
  };

  for ( var attr in opts ){
    that[ attr ] = opts[ attr ];
  }

  if ( that.queryVariable && !that.queryStringRegex ){
    that.queryStringRegex = new RegExp( that.queryVariable + "=([^&]+)", "g" );
  }

  return that;
};

(function(){
  for ( var i = 0; i < SearchExtension.searchConfigs.length; i++ ){
    SearchExtension.searches.push( new SearchExtension.Search( SearchExtension.searchConfigs[i] ) );
  }
})();

SearchExtension.main = function( url ){

  var page = SearchExtension.getPageObj( url ),
      searches = SearchExtension.searches;

  if ( !page.isSearch ){
    SearchExtension.log( "Page is not a search. Quitting.");
    return false;
  } else {
    SearchExtension.log( "Page is a " + page.selectedSearch.name + " search." );
  }

  for ( var i = 0; i < searches.length; i++ ){
    page.searches.push({
      name: searches[i].name,
      url: searches[i].getQuery( page.query ),
      currentSearch: (page.selectedSearch === searches[i])
    });
  }

  return page;
};

SearchExtension.getPageObj = function( url ){
  url = url.toLowerCase();
  
  var page = {
        url: url,
        isSearch: false,
        searches: []
      },
      searches = SearchExtension.searches,
      query;

  for ( var i = 0; i < searches.length; i++ ){
    
    SearchExtension.log( "Checking Search " + searches[i].name +
                         " against url: " + url +
                         " - " + searches[i].checkUrl( url ) );
    
    if ( searches[i].checkUrl( url ) ){
      query = searches[i].getQueryValue( url );

      if ( query ){
        page.query = query;
        page.isSearch = true;
        page.selectedSearch = searches[i];
      }

      break;
    }
  }

  return page;
};

SearchExtension.log = function( message ){
  console.log( Date() + ": EVENTS.JS - " +  message);
};

chrome.extension.onMessage.addListener( function( message, sender, sendResponse ){

  if ( message.indexOf( "page::" ) <= -1 ){
    return;
  }

  var url = message.split("::")[1],
      page;

  SearchExtension.log( "Request recieved for url " + url );

  if ( url ){
    page = SearchExtension.main( url );
  }

  sendResponse( page );
});