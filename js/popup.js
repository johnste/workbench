 document.addEventListener('DOMContentLoaded', function () {


	var backgroundPage = chrome.extension.getBackgroundPage();

	var sites = [];

	var sitelist = document.querySelector('#sites');

	document.getElementsByTagName("h1")[0].innerText = backgroundPage.currentProject.name;
	for(var i in backgroundPage.currentProject.sites) {

		var site = backgroundPage.currentProject.sites[i];
		var a = document.createElement("a");
		a.href = site.url;
		a.innerText = site.name;
		var strong = document.createElement("strong");
		strong.innerText = site.letter;
		a.appendChild(strong);
		a.title = site.url;
		if(site == backgroundPage.currentSite) {
			a.className = "site active";
		} else {
			a.className = "site";
		}

		a.addEventListener('click', function(){
			//var a = this;
			//chrome.tabs.captureVisibleTab(window.id, )
			chrome.tabs.update(backgroundPage.currentTabId,
			{
				url: this.href + (backgroundPage.settings.keep_path ? backgroundPage.currentPath : "")
			});
			console.log(this.parentNode.parentNode);
			this.parentNode.parentNode.querySelector(".active").className = "site";
			this.className = "site active";
		});

		var li = document.createElement("li");
		li.appendChild(a);
		sitelist.appendChild(li);
	}

	document.querySelector("a.options").addEventListener('click', function(){
		//var a = this;
		//chrome.tabs.captureVisibleTab(window.id, )
		chrome.tabs.create(
		{
			url: chrome.extension.getURL("html/options.html")
		})
	});


});

