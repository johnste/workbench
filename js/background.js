

  var projects = JSON.parse(localStorage["ls.workbench"]);

  var currentProject = null;
  var currentSite = null;
  var currentTabId = null;
  var currentTab = null;
  var currentPath = null;
  var settings = null;
  var currentCookies = null;

  var changeActiveTab = function (tabId, selectInfo) {
    chrome.tabs.get(tabId, function(tab) {
      checkForValidUrl(tabId, null, tab);
    });
  }

  chrome.tabs.onActiveChanged.addListener(changeActiveTab);

  // Called when the url of a tab changes.
  var checkForValidUrl = function(tabId, changeInfo, tab) {

   settings = JSON.parse(localStorage["ls.workbench"]);
   for(var i in settings.projects) {
    for(var j in settings.projects[i].sites) {
        if(tab.url.indexOf(settings.projects[i].sites[j].url) == 0) {

          currentProject = settings.projects[i];
          currentSite = settings.projects[i].sites[j];
          currentTabId = tabId;
          currentPath = tab.url.substring(settings.projects[i].sites[j].url.length);
          showIcon(tabId, settings.projects[i].sites[j].abbreviation);

          chrome.cookies.getAll({
            url: settings.projects[i].sites[j].url
          }, function(cookies) {
            currentCookies = cookies;
          });


        }
      }
    }
  };

  // Listen for any changes to the URL of any tab.
  chrome.tabs.onUpdated.addListener(checkForValidUrl);

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


