"use strict";

function ProjectCtrl($scope, localStorageService) {
  var settings = angular.fromJson(localStorageService.get('workbench')) || [];
  var projects = $scope.projects = settings.projects || [];
  $scope.keepPath = settings.options && settings.options.keepPath || false;

  console.log(settings.options);
  $scope.storageType = 'Local storage';

  $scope.addProject = function () {
    console.log("Add project");
    projects.push({name:"", sites:[]});

  }

  $scope.addSite = function (project) {
    var projNum = projects.indexOf(project);
    console.log("Add site", $scope, project);
    projects[projNum].sites.push({name:"", url:"", letters:"", predefinedName:"Acceptance"});
  }

  $scope.delProject = function (project) {
    console.log("Remove project");
    projects.splice(projects.indexOf(project), 1);
  }

  $scope.delSite = function (project, site) {
    console.log("Remove site");
    project.sites.splice(project.sites.indexOf(site), 1);
  }

  $scope.saveSettings = function () {
    localStorageService.add('workbench', angular.toJson({projects: projects,
      options: {
        keepPath: $scope.keepPath
      }
    }));
  }

  $scope.updateSiteName = function (project, site) {
    console.log("Update name");
    if (site.predefinedName !== '') {
      site.name = site.predefinedName;
    }
  }
}
