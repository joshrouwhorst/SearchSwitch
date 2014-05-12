angular.module( 'SearchSwitch' )

.factory('BackgroundPageService', [function(){
  var backgroundPage = chrome.extension.getBackgroundPage();

  if ( backgroundPage && backgroundPage.SearchSwitch ) {
    return backgroundPage.SearchSwitch;
  } else {
    return false;
  }

}]);