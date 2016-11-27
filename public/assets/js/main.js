'use strict';

angular.module('cv-noc', ['ui.router','hSweetAlert'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){  

  $stateProvider
    .state('stores', {url: '/stores', templateUrl: 'partials/stores.html', controller: 'storesCtrl'})
    .state('products', {url: '/products', templateUrl: 'partials/products.html', controller: 'storesCtrl'})
    .state('store-detail', {url: '/store-detail',templateUrl: 'partials/store-detail.html', controller: 'storeDetailCtrl'})
    .state('product-detail', {url: '/product-detail',templateUrl: 'partials/product-detail.html', controller: 'productDetailCtrl'})
    .state('seasons', {url: '/seasons', templateUrl: 'partials/seasons.html', controller: ''})
    ;

    $urlRouterProvider.otherwise('/stores');

})

.run(function($rootScope, $location, $timeout, $state, $http, $window){

})

//controller---------------------------------------------------------------------------------------------------------------------------

.controller('storeDetailCtrl', function($scope, $rootScope, $stateParams, $state, sweet) {


    }   
)

.controller('productDetailCtrl', function($scope, $rootScope, $stateParams, $state, sweet) {


    }   
)

.controller('storesCtrl', function($scope, $rootScope, $state, $location) {
 	$scope.id = "sophie101";
})

;
