'use strict';

/* Angular module */
angular.module('workbench', ['LocalStorageModule']).
  config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {

  // Add routes
  $routeProvider.
      when('/projects', {templateUrl: 'project-list.html',   controller: ProjectListCtrl}).
      when('/projects/:projectId', {templateUrl: 'project-detail.html', controller: ProjectDetailCtrl}).
      otherwise({redirectTo: '/projects'});

  // Add chrome-extension protocol to whitelist
  $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
}]);