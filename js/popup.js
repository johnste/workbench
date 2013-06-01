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
		a.title = site.url;
		var strong = document.createElement("strong");
		strong.innerText = site.abbreviation;
		a.appendChild(strong);
		a.title = site.url;
		if(site == backgroundPage.currentSite) {
			a.className = "site active";
		} else {
			a.className = "site";
		}

		a.addEventListener('click', function(event){
			//var a = this;
			//chrome.tabs.captureVisibleTab(window.id, )

			/*if ( backgroundPage.currentCookies.length > 0) {
				for(var i = 0; i < backgroundPage.currentCookies.length; i++) {
					var cookie = backgroundPage.currentCookies[i];
					var newCookie = {
						url: this.href,
						name: cookie.name,
						value: cookie.value
					};
					console.log(cookie, newCookie);
					chrome.cookies.set(newCookie, function(c) {
						console.log(chrome.runtime.lastError);
					});
				}

			}*/

			if(event.button == 0) {
				chrome.tabs.update(backgroundPage.currentTabId,
				{
					url: this.href + (backgroundPage.settings.options.keepPath ? backgroundPage.currentPath : "")
				});
			}


			this.parentNode.parentNode.querySelector(".active").className = "site";
			this.className = "site active";
			setTimeout(function(){window.close();}, 350);

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

