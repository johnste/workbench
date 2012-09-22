
document.getElementById("save_btn").addEventListener('click', save_options);
document.getElementById("new_project_btn").addEventListener('click', new_project);

document.addEventListener('DOMContentLoaded', function () {
  restore_options();
});

// Saves options to localStorage.
function save_options() {
  //var select = document.getElementById("color");

  //localStorage["favorite_color"] = color;

  // Update status to let user know options were saved.
  var settings = {
    "keep_path": !document.getElementById("keep_path").checked,
    "projects": []
  };

  var projectlist = document.querySelectorAll("#projects > li:not(.empty)");
  for (var i = 0; i < projectlist.length; ++i) {
    var sitelist = projectlist[i].getElementsByTagName("li");
    var sites = [];
    for (var j = 0; j < sitelist.length; ++j) {
      var site = {
        "name": sitelist[j].querySelector(".project_custom_site_name").value,
        "letter": sitelist[j].querySelector(".site_letter").value,
        "url": sitelist[j].querySelector(".site_url").value,
      }
      sites.push(site);
    }

    var project = {
      "name": projectlist[i].querySelector(".project_name").value,
      "sites": sites
    };
    settings.projects.push(project);
  }

  localStorage["settings"] = JSON.stringify(settings);

  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var settings = JSON.parse(localStorage["settings"]);
  console.log(settings);
  document.getElementById("keep_path").checked = !settings.keep_path;
  var projects = document.getElementById("projects");
  for (var i = 0; i < settings.projects.length; ++i) {
    new_project(null, true);
    projects.querySelector("li:last-child .project_name").value = settings.projects[i].name;
    for (var j = 0; j < settings.projects[i].sites.length; ++j) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
      projects.querySelector("li:last-child .new_site_btn").dispatchEvent(evt);
      projects.querySelector("li:last-child li:last-child .project_custom_site_name").value = settings.projects[i].sites[j].name;
      projects.querySelector("li:last-child li:last-child select").value = settings.projects[i].sites[j].name;
      projects.querySelector("li:last-child li:last-child .site_url").value = settings.projects[i].sites[j].url;
      projects.querySelector("li:last-child li:last-child .site_letter").value = settings.projects[i].sites[j].letter;
    }
  }
}

function new_project(event, do_not_insert_site) {
  var tmpl = document.getElementById("new_project_tmpl");
  var projects = document.getElementById("projects");

  var li = document.createElement("li");
  li.innerHTML = tmpl.innerHTML;
  projects.appendChild(li);

  var nodelist = projects.querySelectorAll(".new_site_btn");
  for (var i = 0; i < nodelist.length; ++i) {
    nodelist[i].addEventListener('click', new_site);
  }

  var nodelist = projects.querySelectorAll(".remove_project_btn");
  for (var i = 0; i < nodelist.length; ++i) {
    nodelist[i].addEventListener('click', toggle_element);
  }

  if (!do_not_insert_site) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent("click", true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);

    projects.querySelector("li:last-child .new_site_btn").dispatchEvent(evt);
  }
}

function new_site() {
  var tmpl = document.getElementById("new_site_tmpl");

  var li = document.createElement("li");
  li.innerHTML = tmpl.innerHTML;
  this.parentNode.parentNode.querySelector('ol.sites').appendChild(li);

  var projects = document.getElementById("projects");

  var nodelist = projects.getElementsByTagName("select");

  for (var i = 0; i < nodelist.length; ++i) {
    nodelist[i].addEventListener('change', show_textarea_if_custom);
  }

  var nodelist = projects.querySelectorAll(".remove_site_btn");
  for (var i = 0; i < nodelist.length; ++i) {
    nodelist[i].addEventListener('click', toggle_element);
  }
}

function toggle_element() {
  remove_delayed(this.parentNode.parentNode);
  this.setAttribute('data-default', this.innerHTML);
}

function remove_delayed(node_to_remove) {

  node_to_remove.className += " deleted";
  setTimeout(function(){
    node_to_remove.parentNode.removeChild(node_to_remove);
  }, 450);
}

function show_textarea_if_custom() {
  var textfield = this.parentNode.querySelector('.project_custom_site_name');
  textfield.value = this.value;

  if (this.value == "") {
    this.className = "custom";
    textfield.setAttribute('style', 'opacity: 1');
  } else {
    textfield.setAttribute('style', 'opacity: 0');
    this.className = "";
  }
}