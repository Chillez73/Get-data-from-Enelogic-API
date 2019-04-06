// Go to Google Apps Script (https://script.google.com) and click 'New script'
  // Give you project a name by clicking 'Untitled project' in the upper left corner

// Add OAuth2 library to your script
  // Click on the menu item "Resources > Libraries..."
  // In the "Find a Library" text box, enter the script ID 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF and click the "Select" button.
  // Choose a version in the dropdown box (usually best to pick the latest version).
  // Click the "Save" button.

// Register your app at the Enelogic developer site
  // Go to https://enelogic.com/nl/developers
  // Create your app and get your AppID and AppSecret
  // Run function logRedirectUri to get the redirect URI for your app
  // URI should look like https://script.google.com/macros/d/<scriptid>/usercallback

// Get redirect URI for this script
function logRedirectUri() {
  var service = getService();
  Logger.log(service.getRedirectUri());
}

// Configure the service
function getEnelogicService() {
  return OAuth2.createService('enelogic')
    .setAuthorizationBaseUrl('https://enelogic.com/oauth/v2/auth')
    .setTokenUrl('https://enelogic.com/oauth/v2/token')
    .setClientId('<insert your Enelogic app id here>')
    .setClientSecret('<insert your Enelogic app secret here>')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('account'); 
}

// handle the callback
function authCallback(request) {
  var enelogicService = getEnelogicService();
  var isAuthorized = enelogicService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

// Get data from API (documentation https://enelogic.docs.apiary.io/#)
// This example retrieves the measuringpoints and writes them to the log
function getEnelogicData() {
   var service = getEnelogicService();
   
   if (service.hasAccess()) {
     Logger.log("App has access.");
     
     var mpoints = "https://enelogic.com/api/measuringpoints/";
     
     var headers = {
       "Authorization": "Bearer " + getEnelogicService().getAccessToken(),
       "Accept": "application/json"
     };
     
     var options = {
       "headers": headers,
       "method" : "GET",
       "muteHttpExceptions": true
     };
     
     var response = UrlFetchApp.fetch(mpoints, options);
     var data = JSON.parse(response.getContentText());
     Logger.log(data);
   }
   
   else {
     Logger.log("App has no access yet.");
     
     // open this url and login with your Enelogic credentials to authorize access
     var authorizationUrl = service.getAuthorizationUrl();
     Logger.log("Open the following URL, login, authorize app and re-run the script: %s",
         authorizationUrl);
   }
 }
