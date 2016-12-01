'use strict';

angular.module('cv-noc', ['ui.router','hSweetAlert'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){  

  $stateProvider
    .state('stores', {url: '/stores', templateUrl: 'partials/stores.html', controller: 'storesCtrl'})
    .state('products', {url: '/products', templateUrl: 'partials/products.html', controller: 'fruitsCtrl'})
    .state('store-detail', {url: '/store-detail/?storeid',templateUrl: 'partials/store-detail.html', controller: 'storeDetailCtrl'})
    .state('fruit-detail', {url: '/product-detail/?fruitid',templateUrl: 'partials/product-detail.html', controller: 'fruitDetailCtrl'})
    .state('seasons', {url: '/seasons', templateUrl: 'partials/seasons.html', controller: ''})
    .state('signup', {url: '/signup', templateUrl: 'partials/signup.html', controller: ''})
    .state('signin', {url: '/signin', templateUrl: 'partials/signin.html', controller: ''})
    .state('account', {url: '/account', templateUrl: 'partials/account.html', controller: ''})
    .state('cart', {url: '/cart', templateUrl: 'partials/cart.html', controller: ''})
    ;

    $urlRouterProvider.otherwise('/stores');

})

.run(function($rootScope, $location, $timeout, $state, $http, $window){

})

//services-----------------------------------------------------------------------------------------------------------------------------
.service('getData', function($http, $rootScope, $location){

    this.getStores = function() {
            return $http({
                method: 'GET',
                url: "/stores"
             });
    };

    this.getStoreDetail = function() {
            return $http({
                method: 'GET',
                url: "/stores/" + $location.search().storeid
             });
    };

    this.getFruits = function() {
            return $http({
                method: 'GET',
                url: "/fruits"
             });
    };

    this.getFruitDetail = function() {
            return $http({
                method: 'GET',
                url: "/fruits/" + $location.search().fruitid
             });
    };

})

//controller---------------------------------------------------------------------------------------------------------------------------

.controller('storesCtrl', function($scope, $rootScope, $state, getData) {
 	
    getData.getStores().success(function(dataResponse){
        console.log(dataResponse);
        $scope.storesList = dataResponse;
    });
})

.controller('storeDetailCtrl', function($scope, $rootScope, $stateParams, $state, $location, getData, sweet) {
        getData.getStoreDetail().success(function(dataResponse){
            console.log(dataResponse);
            $scope.storeDetail = dataResponse;
        });

    }   
)

.controller('fruitsCtrl', function($scope, $rootScope, $state, $location, getData) {
    
    getData.getFruits().success(function(dataResponse){
        console.log(dataResponse);
        $scope.fruitsList = dataResponse;
    });
})

.controller('fruitDetailCtrl', function($scope, $rootScope, $stateParams, $state, getData, sweet) {
        getData.getFruitDetail().success(function(dataResponse){
            console.log(dataResponse);
            $scope.fruitDetail = dataResponse;
        });

    }   
)

;
