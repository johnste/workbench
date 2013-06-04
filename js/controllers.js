'use strict';

/* Controllers */


// Control for list page
function ProjectListCtrl($scope, localStorageService) {
  var settings = angular.fromJson(localStorageService.get('workbench')) || {
    projects: [],
  };

  $scope.projects = settings.projects || [];
  $scope.selected = false;

  // Callback to add new project, inserts new empty project and saves
  $scope.addProject = function () {
    var project = {
      id: guid(),
      name:"",
      keepPath: true,
      migrateCookies: false,
      sites:[]
    };

    console.log("Add project", project);
    $scope.projects.push(project);

    localStorageService.add('workbench', angular.toJson(settings));

  }

    // Toggle anything selected state
  $scope.updateSelected = function () {
    $scope.selected = false;
    for(var i = 0; i < $scope.projects.length; i++) {
      if($scope.projects[i].selected) {
        $scope.selected = true;
        break;
      }
    }
  }

  // Delete projects (after confirmation)
  $scope.deleteProjects = function () {
    var confirm, project;
    if(!$scope.selected)
      return;

    confirm = window.confirm("Are you sure you want to remove the selected projects?");
    if (confirm) {
      $scope.selected = false;
      for(var i = $scope.projects.length - 1; i >= 0 ; i--) {

        project = $scope.projects[i];
        if($scope.projects[i].selected) {
          $scope.projects.splice(i, 1);
        }
      }
      localStorageService.add('workbench', angular.toJson(settings));
    }
  }
}

// Project settings form controller
function ProjectDetailCtrl($scope, $routeParams, localStorageService) {
  var settings = angular.fromJson(localStorageService.get('workbench')) || {
    projects: [],
  };

  $scope.id = $routeParams.projectId;

  $scope.projects = settings.projects || [];
  $scope.project = undefined;

  // Get active project from settings
  for(var i = 0; i < $scope.projects.length; i++) {
    if($scope.projects[i].id == $scope.id) {
      $scope.project = $scope.projects[i];
    }
  }

  $scope.goBack = function() {
    window.history.back();
  }

  // Add new site to current project
  $scope.addSite = function () {
    $scope.project.sites.push({name:"Acceptance", url:"", letters:"", predefinedName:"Acceptance"});
  }

  // Update site name on dropdown change
  $scope.updateSiteName = function (site) {
    if (site.predefinedName !== '') {
      site.name = site.predefinedName;
    }
  }

  // Save project (and everything else as well)
  // TODO: Make sure settings haven't change in another tab before saving.
  $scope.saveProject = function () {
    localStorageService.add('workbench', angular.toJson(settings));
  }

}


