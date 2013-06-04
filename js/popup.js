 document.addEventListener('DOMContentLoaded', function () {

	var backgroundPage = chrome.extension.getBackgroundPage();

	var sites = [];
	var sitelist = document.querySelector('#sites');

	document.getElementsByTagName("h1")[0].innerText = backgroundPage.currentState.project.name;

	// Populate page action popup with links to switch between active sites
	for(var i in backgroundPage.currentState.project.sites) {

		var site = backgroundPage.currentState.project.sites[i];
		var a = document.createElement("a");
		a.href = site.url;
		a.innerText = site.name;
		a.title = site.url;
		var strong = document.createElement("strong");
		strong.innerText = site.abbreviation;
		a.appendChild(strong);
		a.title = site.url;
		if(site == backgroundPage.currentState.site) {
			a.className = "site active";
		} else {
			a.className = "site";
		}

		// Switch between sites.
		a.addEventListener('click', function(event){
			// TODO: Make sure cookie migration works as expected
			/*if ( backgroundPage.currentState.cookies.length > 0) {
				for(var i = 0; i < backgroundPage.currentState.cookies.length; i++) {
					var cookie = backgroundPage.currentState.cookies[i];
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
				chrome.tabs.update(backgroundPage.currentState.tabId,
				{
					url: this.href + (backgroundPage.currentState.project.keepPath ? backgroundPage.currentState.path : "")
				});
			}

			this.parentNode.parentNode.querySelector(".active").className = "site";
			this.className = "site active";

			// Close popup after a short delay
			setTimeout(function(){window.close();}, 350);

		});

		var li = document.createElement("li");
		li.appendChild(a);
		sitelist.appendChild(li);
	}

	document.querySelector("a.options").addEventListener('click', function(){
		chrome.tabs.create(
		{
			url: chrome.extension.getURL("html/options.html")
		})
	});


});

