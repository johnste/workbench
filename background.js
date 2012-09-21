// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var projects = JSON.parse(localStorage["settings"]);

var currentProject = null;
var currentSite = null;
var currentTabId = null;
var currentTab = null;
var currentPath = null;

chrome.tabs.onActiveChanged.addListener(changeActiveTab);

function changeActiveTab(tabId, selectInfo) {
  chrome.tabs.get(tabId, function(tab) {
    checkForValidUrl(tabId, null, tab);
  });
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
 projects = JSON.parse(localStorage["settings"]);
 for(var i in projects) {
  for(var j in projects[i].sites) {
      if(tab.url.indexOf(projects[i].sites[j].url) == 0) {
        showIcon(tabId, projects[i].sites[j].letter);
        currentProject = projects[i];
        currentSite = projects[i].sites[j];
        currentTabId = tabId;
        currentPath = tab.url.substring(projects[i].sites[j].url.length);
      }
    }
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function showIcon(tabId, letter) {

  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;
  var context = canvas.getContext('2d');

  gradient = context.createLinearGradient(0, 0, 0, 19);
  gradient.addColorStop(0,"rgb(242,115,41)");  //start from blue
  gradient.addColorStop(1,"rgb(242,65,48)"); //end to green

  /*context.fillStyle = "rgb(242,65,48)";*/
  context.fillStyle = gradient;
  context.fillRect(1,0,17,19);
  context.fillRect(0,1,19,17);


  context.font =  "bold 18px arial";

  context.textAlign = "center";
  context.textBaseline = "top";

  context.fillStyle = "white";
  context.fillText(letter, 10, 0);

  var imageData = context.getImageData(0, 0, 19, 19);
  chrome.pageAction.setIcon({
    imageData: imageData,
    tabId: tabId
  });

  chrome.pageAction.show(tabId);
}

