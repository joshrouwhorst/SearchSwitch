var SearchSwitch = {
  encodings: {}
};

SearchSwitch.encodings.pluses = function( query ){
  query = query.replace( / /g, '+' );
  query = encodeURI( query );

  return query;
};

SearchSwitch.encodings.standard = encodeURIComponent;

SearchSwitch.searchConfigs = [
  {
    name: "Google",
    url: "www.google.com",
    queryVariable: "q",
    resultsPage: '#',
    encodingFunction: SearchSwitch.encodings.standard,
    subSearches: [
      {
        name: 'Images',
        url: 'www.google.com',
        queryVariable: 'q',
        resultsPage: '#',
        encodingFunction: SearchSwitch.encodings.standard,
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
        encodingFunction: SearchSwitch.encodings.standard,
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
    encodingFunction: SearchSwitch.encodings.standard
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
      SearchSwitch.log( "Getting query value of " + url );

      var query = url.match( /wiki\/([^?]+)/g );

      SearchSwitch.log( "Query value - " + query );

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
    encodingFunction: SearchSwitch.encodings.pluses
  },
  {
    name: "Bing",
    url: "www.bing.com",
    queryVariable: 'q',
    resultsPage: 'search?',
    encodingFunction: SearchSwitch.encodings.pluses,
    subSearches: [
      {
        name: "Images",
        url: "www.bing.com",
        queryVariable: 'q',
        resultsPage: 'images/search?',
        encodingFunction: SearchSwitch.encodings.pluses
      },
      {
        name: "Videos",
        url: "www.bing.com",
        queryVariable: 'q',
        resultsPage: 'videos/search?',
        encodingFunction: SearchSwitch.encodings.pluses
      }
    ]
  }
];

SearchSwitch.searches = [];

SearchSwitch.Search = function( opts ){
  var that = this,
      subSearches = [];

  that.checkUrl = function( url ){
    var regex = new RegExp( "http(?:s)?:\/\/" + that.url, "g" );

    if ( url.match( regex ) !== null ){
        return true;
      }

      return false;
  };

  that.getQueryValue = function( url ){
    SearchSwitch.log( "Getting query value of " + url );

    var query = url.match( that.queryStringRegex );

    SearchSwitch.log( "Query value - " + query );

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

  that.getSubSearches = function(){
    return subSearches;
  };

  that.getJSON = function( page ){
    var returnObj = {
      name: that.name,
      url: that.getQuery( page.query ),
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

  for ( var attr in opts ){
    if ( attr === 'subSearches' ) {
      continue;
    }

    that[ attr ] = opts[ attr ];
  }

  if ( opts.subSearches && opts.subSearches.length > 0 ){
    for ( var i = 0; i < opts.subSearches.length; i++ ){
      subSearches.push( new SearchSwitch.Search( opts.subSearches[i] ) );
    }
  }

  if ( that.queryVariable && !that.queryStringRegex ){
    that.queryStringRegex = new RegExp( that.queryVariable + "=([^&]+)", "g" );
  }

  return that;
};

(function(){
  for ( var i = 0; i < SearchSwitch.searchConfigs.length; i++ ){
    SearchSwitch.searches.push( new SearchSwitch.Search( SearchSwitch.searchConfigs[i] ) );
  }
})();

SearchSwitch.main = function( url ){

  var page = SearchSwitch.getPageObj( url ),
      searches = SearchSwitch.searches;

  if ( !page.isSearch ){
    SearchSwitch.log( "Page is not a search. Quitting.");
    return false;
  } else {
    SearchSwitch.log( "Page is a " + page.selectedSearch.name + " search." );
  }

  chrome.tabs.getSelected( null, function( tab ){
    chrome.pageAction.show( tab.id );
  });

  for ( var i = 0; i < searches.length; i++ ){
    page.searches.push( searches[i].getJSON( page ) );
  }

  return page;
};

SearchSwitch.getPageObj = function( url ){
  url = url.toLowerCase();
  
  var page = {
        url: url,
        isSearch: false,
        searches: []
      },
      searches = SearchSwitch.searches,
      query;

  for ( var i = 0; i < searches.length; i++ ){
    
    SearchSwitch.log( "Checking Search " + searches[i].name +
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

SearchSwitch.log = function( message ){
  console.log( Date() + ": EVENTS.JS - " +  message);
};

chrome.extension.onMessage.addListener( function( message, sender, sendResponse ){

  if ( message.indexOf( "page::" ) <= -1 ){
    return;
  }

  var url = message.split("::")[1],
      page;

  SearchSwitch.log( "Request recieved for url " + url );

  if ( url ){
    page = SearchSwitch.main( url );
  }

  sendResponse( page );
});