'use strict';

angular.module('ripe-central', ['ui.router','ngCookies','hSweetAlert'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){  

  $stateProvider
    .state('stores', {url: '/stores', templateUrl: 'partials/stores.html', controller: 'storesCtrl'})
    .state('products', {url: '/products', templateUrl: 'partials/products.html', controller: 'fruitsCtrl'})
    .state('store-detail', {url: '/store-detail/?storeid',templateUrl: 'partials/store-detail.html', controller: 'storeDetailCtrl'})
    .state('fruit-detail', {url: '/product-detail/?fruitid',templateUrl: 'partials/product-detail.html', controller: 'fruitDetailCtrl'})
    .state('seasons', {url: '/seasons', templateUrl: 'partials/seasons.html', controller: ''})
    .state('signup', {url: '/signup', templateUrl: 'partials/signup.html', controller: 'signupCtrl'})
    .state('signin', {url: '/signin', templateUrl: 'partials/signin.html', controller: 'signinCtrl'})
    .state('account', {url: '/account', templateUrl: 'partials/account.html', controller: ''})
    .state('cart', {url: '/cart', templateUrl: 'partials/cart.html', controller: ''})
    .state('users', {url: '/users', templateUrl: 'partials/users.html', controller: 'usersCtrl'})
    .state('carts', {url: '/carts', templateUrl: 'partials/carts.html', controller: 'cartsCtrl'})
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

    this.deleteStore = function() {
            return $http({
                method: 'DELETE',
                url: "/stores/" + $rootScope.deleteStoreId
             });
    };

    this.modifyStoreDetail = function() {
            return $http({
                method: 'POST',
                data:$rootScope.modStoreObj,
                url: "/stores/" + $location.search().storeid
             });
    };

    this.getFruits = function() {
            return $http({
                method: 'GET',
                url: "/fruits"
             });
    };

    this.modifyFruitDetail = function() {
            return $http({
                method: 'POST',
                data:$rootScope.modFruitObj,
                url: "/fruits/" + $location.search().fruitid
             });
    };

    this.deleteFruit = function() {
            return $http({
                method: 'DELETE',
                url: "/fruits/" + $rootScope.deleteFruitId
             });
    };

    this.getFruitDetail = function() {
            return $http({
                method: 'GET',
                url: "/fruits/" + $location.search().fruitid
             });
    };

    this.validateLogin = function() {
            return $http({
                method: 'POST',
                data: $rootScope.userSignup,
                url: "/login"
             });
    };

    this.signThisPersonUp = function() {
            return $http({
                method: 'POST',
                data: $rootScope.userSignup,
                url: "/signup"
             });
    };

    this.getUsers = function() {
            return $http({
                method: 'GET',
                url: "/users"
             });
    };

    this.deleteUser = function() {
            return $http({
                method: 'DELETE',
                url: "/users/" + $rootScope.deleteUserId
             });
    };

    this.getCarts = function() {
            return $http({
                method: 'GET',
                url: "/carts"
             });
    };

    this.postStoreComment = function() {
        return $http({
            method: 'POST',
            data: $rootScope.storeComment,
            url: "/comments/stores"
        });
    };

    this.postFruitComment = function() {
        return $http({
            method: 'POST',
            data: $rootScope.fruitComment,
            url: "/comments/stores"
        });
    };
})

//controller---------------------------------------------------------------------------------------------------------------------------

.controller('storesCtrl', function($scope, $rootScope, $state, getData) {
 	
    getData.getStores().success(function(dataResponse){
        console.log(dataResponse);
        $scope.storesList = dataResponse;

        $scope.deleteThisStore = function(storeid){
                $rootScope.deleteStoreId = storeid;
                console.log("delete called");
                getData.deleteStore().success(function(dataResponse){
                    console.log(dataResponse);
                    $state.reload();
                });
            }
    });
})

.controller('storeDetailCtrl', function($scope, $rootScope, $stateParams, $state, $location, getData, sweet) {
        getData.getStoreDetail().success(function(dataResponse){
            console.log(dataResponse);
            $scope.storeDetail = dataResponse;
            $scope.editMode = false;

            $scope.toggleEdit = function(){
                if($scope.editMode == true){
                    $scope.editMode = false;
                }else{
                    $scope.editMode = true;
                }
            }

            $rootScope.modStoreObj = {
                storeId: $scope.storeDetail.storeId,
                name: $scope.storeDetail.name,
                address: {
                  street: "String",
                  city: "String",
                  province: "String",
                  postalcode: "String"
                },
                photo: $scope.storeDetail.photo
            };

            $scope.modCurrentStore = function(){
                getData.modifyStoreDetail().success(function(dataResponse){
                    console.log(dataResponse);
                });
            }

            $rootScope.storeComment = {
                storeId: $scope.storeDetail.storeId,
                message: "",
                username: $rootScope.username
            };

            $scope.commentOnStore = function() {
                getData.postStoreComment().success(function(dataResponse) {
                    console.log(dataResponse);
                });
            }

        });

    }   
)

.controller('fruitsCtrl', function($scope, $rootScope, $state, $location, getData) {
    
    getData.getFruits().success(function(dataResponse){
        console.log(dataResponse);
        $scope.fruitsList = dataResponse;

        $scope.deleteThisFruit = function(fruitid){
                $rootScope.deleteFruitId = fruitid;
                console.log("delete called");
                getData.deleteFruit().success(function(dataResponse){
                    console.log(dataResponse);
                    $state.reload();
                });
            }
    });
})

.controller('fruitDetailCtrl', function($scope, $rootScope, $stateParams, $state, getData, sweet) {
        getData.getFruitDetail().success(function(dataResponse){
            console.log(dataResponse);
            $scope.fruitDetail = dataResponse;
            $scope.editMode = false;

            $scope.toggleEdit = function(){
                if($scope.editMode == true){
                    $scope.editMode = false;
                }else{
                    $scope.editMode = true;
                }
            }

            $rootScope.modFruitObj = {
                storeId: $scope.fruitDetail.storeId,
                price: $scope.fruitDetail.price,
                photo: $scope.fruitDetail.photo,
                unit: $scope.fruitDetail.unit,
                season: $scope.fruitDetail.season,
                type: $scope.fruitDetail.type
            };

            $scope.modCurrentFruit = function(){
                getData.modifyFruitDetail().success(function(dataResponse){
                    console.log(dataResponse);
                });
            }

            $rootScope.fruitComment = {
                storeId: $location.search().fruitid,
                message: "",
                username: $rootScope.username
            };

            $scope.commentOnFruit = function() {
                getData.postFruitComment().success(function(dataResponse) {
                    console.log(dataResponse);
                });
            }

        });

    }   
)

.controller('signinCtrl', function($scope, $rootScope, $state, $location, $cookies, getData) {
    $rootScope.userCred = {
        username: '',
        password: ''
    }

    $scope.signIn = function(){
        getData.validateLogin().success(function(dataResponse){
            console.log(dataResponse);
            console.log("is admin:", $cookies.get('user.admin'));
           
        });
    }
    
})

.controller('signupCtrl', function($scope, $rootScope, $state, $location, $cookies, getData) {
    $rootScope.userSignup = {
        username: '',
        password: '',
        confirmpassword: '',
        firstname: '',
        lastname: '',
        address: {
           street: "String",
           city: "String",
           province: "String",
           postalcode: "String"
           },

        email: ''
    }

    $scope.signUp = function(){
        getData.signThisPersonUp().success(function(dataResponse){
            console.log(dataResponse);           
        });
    }
    
})

.controller('usersCtrl', function($scope, $rootScope, $state, $location, getData) {
    
    getData.getUsers().success(function(dataResponse){
        console.log(dataResponse);
        $scope.fruitsList = dataResponse;

        $scope.deleteThisUser = function(userid){
                $rootScope.deleteUserId = userid;
                console.log("delete called");
                getData.deleteUser().success(function(dataResponse){
                    console.log(dataResponse);
                    $state.reload();
                });
            }
    });
})

.controller('cartsCtrl', function($scope, $rootScope, $state, $location, getData) {
    
    getData.getCarts().success(function(dataResponse){
        console.log(dataResponse);
        $scope.cartsList = dataResponse;

    });
})

;
