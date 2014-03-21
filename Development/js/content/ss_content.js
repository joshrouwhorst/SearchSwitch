var SearchExtension = {
  $: $
};

SearchExtension.log = function( message ){
  console.log( Date() + ": CONTENT.JS - " + message);
};

SearchExtension.init = function(){
  var app = SearchExtension,
      $ = app.$;

  app.log( "Requesting page." );

  chrome.extension.sendMessage("page::" + document.location.href, function( page ){
    var searchClass;

    app.log( "Response recieved - " + page);
    
    $( ".ext-search-container" ).remove();

    if ( page ) {
      app.log( "page.isSearch=" + page.isSearch );
    } else {
      return;
    }
    
    $(function(){
        var html,
            searchClass = '';

      if ( !page || !page.isSearch ){
        return;
      }

      if ( page.selectedSearch.position ){
        searchClass = ' position-set';
      } else {
        searchClass = ' position-top';
      }

      if ( page.selectedSearch.barClass ){
        searchClass += ' ' + page.selectedSearch.barClass;
      }
      
      html = '<div id="extMouseBar" class="ext-mouse-bar"></div><div id="extSearchBar" class="ext-search-bar' + searchClass + '"><ul>';

      for (var i = 0; i < page.searches.length; i++){
        if ( page.searches[i].currentSearch ){
          searchClass = " selected";
        } else {
          searchClass = "";
        }

        html += '<li class="search' + searchClass + '"><a href="' + page.searches[i].url + '">' + page.searches[i].name + '</a></li>';
      }

      html += '</ul></div><script type="text/javascript">SearchExtension.searchBarLoaded();</script>';
      
      html = '<div id="extSearchContainer" class="ext-search-container">' + html + '</div>';

      if ( page.selectedSearch.position &&
           page ){

      }

      $(window.document.body).prepend( html );

      app.log( "Added search bar." );
    });
  });
};

SearchExtension.searchBarLoaded = function(){
  var app = SearchExtension;

  app.log( "Search bar rendered." );

  $( '.ext-mouse-bar' ).mouseenter(function(){
    app.log( 'ext-mouse-bar.mouseenter fired.' );
    $( '.ext-search-bar' ).slideDown('fast');
  });

  $( '.ext-search-bar' ).mouseleave(function(){

    app.log( 'ext-search-bar.mouseleave fired.' );

    $( '.ext-search-bar' ).slideUp('fast');
  });
};

window.addEventListener( "hashchange", SearchExtension.init );

window.addEventListener( "popstate", SearchExtension.init );

SearchExtension.checkLocationChange = function(){
  if ( document.location.href !== SearchExtension.lastLocation ){
    SearchExtension.lastLocation = document.location.href;
    SearchExtension.init();
  }

  setTimeout( SearchExtension.checkLocationChange, 1000);
};

SearchExtension.init();
SearchExtension.checkLocationChange();

