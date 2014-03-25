(function(){

var SearchSwitch = angular.module( 'SearchSwitch', [] );

SearchSwitch.factory( 'BackgroundPage', [function(){
  var backgroundPage = chrome.extension.getBackgroundPage();

  if ( backgroundPage && backgroundPage.SearchSwitch ) {
    return backgroundPage.SearchSwitch;
  } else {
    return false;
  }

}]);

})();


