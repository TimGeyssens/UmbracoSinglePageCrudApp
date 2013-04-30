angular.module('project', []).
  config(function ($routeProvider) {
      $routeProvider.
        when('/', { controller: ListCtrl, templateUrl: '/AngularJSViews/list.html' }).
        when('/edit/:Id', { controller: EditCtrl, templateUrl: '/AngularJSViews/detail.html' }).
        when('/new', { controller: CreateCtrl, templateUrl: '/AngularJSViews/detail.html' }).
        otherwise({ redirectTo: '/' });
  });

function ListCtrl($scope, $http, $rootScope) {
    
    $scope.loading = true;
    $scope.statuses = {};

    $scope.showAlert = $rootScope.alert;
    $scope.alert = $rootScope.alertMessage;
        
    $http({ method: 'GET', url: '/umbraco/api/StatusApi/GetAllStatuses/', params: { parentId: currentUmbracoPageId } })
        .success(function(data) {
            $scope.statuses = data;
            $scope.loading = false;
        })
        .error(function() {
            $scope.error = "An Error has occured while loading!";
            $scope.loading = false;
        });

}

function CreateCtrl($scope, $http, $location, $rootScope) {
    $scope.action = "Add";
    $scope.saving = false;
    
    $rootScope.alert = false;
    
    $scope.save = function () {
        $scope.saving = true;
        
        $http({ method: 'POST', url: '/umbraco/api/StatusApi/PostStatus/', params: { parentId: currentUmbracoPageId }, data: $scope.status })
            .success(function (data) {
                $rootScope.alert = true;
                $rootScope.alertMessage = "New status added";
                $scope.saving = false;
                $location.path('/list');
                
            })
            .error(function () {
                $scope.error = "An Error has occured while submitting!";
                $scope.saving = false;
            });
    };
}

function EditCtrl($scope, $http, $location, $routeParams, $rootScope) {
    
    $scope.loading = true;
    $scope.action = "Edit";
    $scope.saving = false;
    
    $rootScope.alert = false;
    
    $http({ method: 'GET', url: '/umbraco/api/StatusApi/GetStatus/', params: { Id: $routeParams.Id } })
        .success(function (data) {
            $scope.status = data;
            $scope.loading = false;
        })
        .error(function () {
            $scope.error = "An Error has occured while loading!";
            $scope.loading = false;
        });

    $scope.destroy = function() {

        if (confirm("Sure you want to delete?")) {
            $http({ method: 'DELETE', url: '/umbraco/api/StatusApi/DeleteStatus/', params: { statusId: $routeParams.Id } })
                .success(function (data) {
                    
                    $rootScope.alert = true;
                    $rootScope.alertMessage = "Status removed";
                    
                    $location.path('/list');
                })
                .error(function () {
                    $scope.error = "An Error has occured while deleting!";
                });
        }
    };
    
    $scope.save = function () {

        $scope.saving = true;
        $http({ method: 'PUT', url: '/umbraco/api/StatusApi/PutStatus/', data: $scope.status })
            .success(function (data) {
                $scope.saving = false;
                
                $rootScope.alert = true;
                $rootScope.alertMessage = "Status updated";
                
                $location.path('/');
            })
            .error(function () {
                $scope.error = "An Error has occured while submitting!";
                $scope.saving = false;
            });
    };
}


