
var currentState = {
  project : null,
  site : null,
  tabId : null,
  path : null,
  cookies : []
};

var changeActiveTab = function (tabId, selectInfo) {
  chrome.tabs.get(tabId, function(tab) {
    checkProjectURL(tabId, null, tab);
  });
}

// Called when the url of a tab changes.
var checkProjectURL = function(tabId, changeInfo, tab) {
  var settings = JSON.parse(localStorage["ls.workbench"]);
  // Are we currently on a site in a project?
  for(var i in settings.projects) {
    for(var j in settings.projects[i].sites) {
      if(tab.url.indexOf(settings.projects[i].sites[j].url) == 0) {

        currentState.project = settings.projects[i];
        currentState.site = settings.projects[i].sites[j];
        currentState.tabId = tabId;
        currentState.path = tab.url.substring(settings.projects[i].sites[j].url.length);
        showIcon(tabId, settings.projects[i].sites[j].abbreviation);

        chrome.cookies.getAll({
          url: settings.projects[i].sites[j].url
        }, function(cookies) {
          currentState.cookies = cookies;
        });
      }
    }
  }
};

// Listen to tab changes
chrome.tabs.onActiveChanged.addListener(changeActiveTab);

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkProjectURL);


// Generate page action icon for current site
var showIcon = function (tabId, abbr) {

  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;
  var context = canvas.getContext('2d');

  gradient = context.createLinearGradient(0, 0, 0, 19);
  gradient.addColorStop(0,"rgb(242,115,41)");
  gradient.addColorStop(1,"rgb(242,65,48)");

  context.fillStyle = gradient;
  context.fillRect(1,0,17,19);
  context.fillRect(0,1,19,17);

  var fontsize = 12;
  var offset = 2;
  context.font =  'bold '+fontsize+'px "Helvetica Neue", Helvetica, Arial, sans-serif';

  context.textAlign = "center";
  context.textBaseline = "top";

  context.fillStyle = "white";
  context.fillText(abbr, 10, offset);

  var imageData = context.getImageData(0, 0, 19, 19);
  chrome.pageAction.setIcon({
    imageData: imageData,
    tabId: tabId
  });

  chrome.pageAction.show(tabId);

}


