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
    
    $( ".ss-search-container" ).remove();

    if ( page ) {
      app.log( "page.isSearch=" + page.isSearch );
    } else {
      return;
    }
    
    $(function(){
        var html,
            searchClass = '',
            subSearches,
            subSearchMenu;

      if ( !page || !page.isSearch ){
        return;
      }

      if ( page.selectedSearch.position ){
        searchClass = ' ss-position-set';
      } else {
        searchClass = ' ss-position-top';
      }

      if ( page.selectedSearch.barClass ){
        searchClass += ' ' + page.selectedSearch.barClass;
      }
      
      html = '<div id="ssMouseBar" class="ss-mouse-bar"></div><div id="ssSearchBar" class="ss-search-bar' + searchClass + '"><ul>';

      for (var i = 0; i < page.searches.length; i++){
        if ( page.searches[i].currentSearch ){
          searchClass = " ss-selected";
        } else {
          searchClass = "";
        }

        subSearches = page.searches[i].subSearches;

        if ( subSearches.length > 0 ){
          subSearchMenu = '<ul class="ss-sub-search">';

          for ( var j = 0; j < subSearches.length; j++ ){
            subSearchMenu += '<li class="ss-search">' +
              '<a href="' + subSearches[j].url + '">' + subSearches[j].name + '</a>' +
              '</li>';
          }

          subSearchMenu += '</ul>';
        } else {
          subSearchMenu = '';
        }

        html += '<li class="ss-search' + searchClass + '">' +
          '<a href="' + page.searches[i].url + '">' + page.searches[i].name + '</a>' +
          subSearchMenu +
          '</li>';
      }

      html += '</ul></div><script type="text/javascript">SearchExtension.searchBarLoaded();</script>';
      
      html = '<div id="ssSearchContainer" class="ss-search-container">' + html + '</div>';

      $(window.document.body).prepend( html );

      app.log( "Added search bar." );
    });
  });
};

SearchExtension.searchBarLoaded = function(){
  var app = SearchExtension;

  app.log( "Search bar rendered." );

  $( '.ss-mouse-bar' ).mouseenter(function(){
    app.log( 'ss-mouse-bar.mouseenter fired.' );
    $( '.ss-search-bar' ).slideDown('fast');
  });

  $( '.ss-search-bar' ).mouseleave(function(){

    app.log( 'ss-search-bar.mouseleave fired.' );

    $( '.ss-search-bar' ).slideUp('fast');
  });

  $( '.ss-search:first-child:not(.ss-sub-search>.ss-search)' ).mouseenter( function(){
      $( '.ss-search-bar' ).addClass( 'ss-unround' );
  });

  $( '.ss-search:first-child:not(.ss-sub-search>.ss-search)' ).mouseleave( function(){
      $( '.ss-search-bar' ).removeClass( 'ss-unround' );
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

