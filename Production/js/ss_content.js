var SearchExtension={$:$};SearchExtension.log=function(a){console.log(Date()+": CONTENT.JS - "+a)},SearchExtension.init=function(){var a=SearchExtension,b=a.$;a.log("Requesting page."),chrome.extension.sendMessage("page::"+document.location.href,function(c){a.log("Response recieved - "+c),b(".ext-search-container").remove(),c&&(a.log("page.isSearch="+c.isSearch),b(function(){var d,e="";if(c&&c.isSearch){e=c.selectedSearch.position?" position-set":" position-top",c.selectedSearch.barClass&&(e+=" "+c.selectedSearch.barClass),d='<div id="extMouseBar" class="ext-mouse-bar"></div><div id="extSearchBar" class="ext-search-bar'+e+'"><ul>';for(var f=0;f<c.searches.length;f++)e=c.searches[f].currentSearch?" selected":"",d+='<li class="search'+e+'"><a href="'+c.searches[f].url+'">'+c.searches[f].name+"</a></li>";d+='</ul></div><script type="text/javascript">SearchExtension.searchBarLoaded();</script>',d='<div id="extSearchContainer" class="ext-search-container">'+d+"</div>",c.selectedSearch.position&&c,b(window.document.body).prepend(d),a.log("Added search bar.")}}))})},SearchExtension.searchBarLoaded=function(){var a=SearchExtension;a.log("Search bar rendered."),$(".ext-mouse-bar").mouseenter(function(){a.log("ext-mouse-bar.mouseenter fired."),$(".ext-search-bar").slideDown("fast")}),$(".ext-search-bar").mouseleave(function(){a.log("ext-search-bar.mouseleave fired."),$(".ext-search-bar").slideUp("fast")})},window.addEventListener("hashchange",SearchExtension.init),window.addEventListener("popstate",SearchExtension.init),SearchExtension.checkLocationChange=function(){document.location.href!==SearchExtension.lastLocation&&(SearchExtension.lastLocation=document.location.href,SearchExtension.init()),setTimeout(SearchExtension.checkLocationChange,1e3)},SearchExtension.init(),SearchExtension.checkLocationChange();
//# sourceMappingURL=ss_source.map