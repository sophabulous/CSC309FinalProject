'use strict';

angular.module('ripe-central', ['ui.router','ngCookies','hSweetAlert'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){

  $stateProvider
    .state('stores', {url: '/stores', templateUrl: 'partials/stores.html', controller: 'storesCtrl'})
    .state('products', {url: '/products', templateUrl: 'partials/products.html', controller: 'fruitsCtrl'})
    .state('store-detail', {url: '/store-detail/?storeid',templateUrl: 'partials/store-detail.html', controller: 'storeDetailCtrl'})
    .state('fruit-detail', {url: '/product-detail/?fruitid',templateUrl: 'partials/product-detail.html', controller: 'fruitDetailCtrl'})
    .state('signup', {url: '/signup', templateUrl: 'partials/signup.html', controller: 'signupCtrl'})
    .state('signin', {url: '/signin', templateUrl: 'partials/signin.html', controller: 'signinCtrl'})
    .state('account', {url: '/account', templateUrl: 'partials/account.html', controller: 'accountCtrl'})
    .state('cart', {url: '/cart', templateUrl: 'partials/cart.html', controller: 'cartCtrl'})
    .state('users', {url: '/users', templateUrl: 'partials/users.html', controller: 'usersCtrl'})
    .state('carts', {url: '/carts', templateUrl: 'partials/carts.html', controller: 'cartsCtrl'})
    .state('orders', {url: '/orders', templateUrl: 'partials/orders.html', controller: 'ordersCtrl'})
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

    this.getFruitsForSeason = function(season) {
            return $http({
                method: 'GET',
                url: "/fruits?season=" + season
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
                data: $rootScope.userCred,
                url: "/login"
             });
    };

    this.logout = function() {
            return $http({
                method: 'GET',
                url: "/signout"
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

    this.getUserCart = function() {
            return $http({
                method: 'GET',
                url: "/carts/" + $rootScope.username
             });
    };

    this.getOrders = function() {
            return $http({
                method: 'GET',
                url: "/orders"
             });
    };

    this.getCurrentUser = function() {
            return $http({
                method: 'GET',
                url: "/users/" + $rootScope.username
             });
    };

    this.modifyUserDetail = function() {
            return $http({
                method: 'POST',
                data:$rootScope.modUserObj,
                url: "/users/" + $rootScope.username
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
                url: "/comments/stores/" + $location.search().storeid
            });
    };

    this.postFruitComment = function() {
            return $http({
                method: 'POST',
                data: $rootScope.fruitComment,
                url: "/comments/fruits/" + $location.search().fruitid
            });
    };

    this.postCheckout = function() {
            return $http({
                method: 'POST',
                data: $rootScope.userCart,
                url: "/checkout/" + $rootScope.username
            });
    };

    this.updateCart = function() {
            return $http({
                method: 'POST',
                data: $rootScope.selectedProduct,
                url: "/carts/" + $rootScope.username
            });
    }
})



.run(function($rootScope, $location, $timeout, $state, $cookies, $http, $window){
    $rootScope.loggedIn =  $cookies.get('loggedIn');
    $rootScope.isAdmin = $cookies.get('isAdmin');
    $rootScope.username = $cookies.get('username');

    console.log($rootScope.loggedIn, $rootScope.isAdmin);

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

            $scope.googleMapSearchStr = 'https://www.google.com/maps/embed/v1/search?q=' + dataResponse.address.street + dataResponse.address.city + '&key=' + 'AIzaSyCDZtYC0RJupz5nw3uU4FEY_LW0OemniuE';
            console.log($scope.googleMapSearchStr);

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
                message: "",
                username: $rootScope.username
            };

            $scope.commentOnStore = function() {
                getData.postStoreComment().success(function(dataResponse) {
                    console.log(dataResponse);
                    $state.reload();
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
                    $state.go('store-detail');
                });
        };
        $scope.getFruitsForSeason = function(season){
             $scope.season = season;
             console.log("got fruits for" + season)
             getData.getFruitsForSeason(season).success(function(dataResponse){
                 $scope.fruitsList = dataResponse;
                //  $state.reload();
             });
        };
    });
})

.controller('fruitDetailCtrl', function($scope, $rootScope, $stateParams, $state, getData, sweet) {
        getData.getFruitDetail().success(function(dataResponse){
            console.log(dataResponse);
            $scope.fruitDetail = dataResponse;
            $scope.editMode = false;

            $scope.addToCart = function(){
                if($scope.editMode == true){
                    $scope.editMode = false;
                }else{
                    $scope.editMode = true;
                }
            }

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
                message: "",
                username: $rootScope.username
            };

            $scope.commentOnFruit = function() {
                getData.postFruitComment().success(function(dataResponse) {
                    console.log(dataResponse);
                    $state.go('fruit-detail');
                });
            }

            $rootScope.selectedProduct = {
                fruitId: $scope.fruitDetail._id,
                quantity: ""
            };

            $scope.addToCart = function() {
                getData.updateCart().success(function(dataResponse) {
                    console.log(dataResponse);
                    $state.go('cart');
                })
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
            $rootScope.loggedIn = true;
            $rootScope.isAdmin = dataResponse.isAdmin;
            $rootScope.username = dataResponse.username;
            $cookies.put('loggedIn', true);
            $cookies.put('isAdmin', dataResponse.isAdmin);
            $cookies.put('username', dataResponse.username);
        });
    }

})

.controller('accountCtrl', function($scope, $rootScope, $state, $location, $cookies, getData) {
    getData.getCurrentUser().success(function(dataResponse){
            console.log(dataResponse);
            $scope.userInfo = dataResponse;
            $scope.editMode = false;

            $scope.toggleEdit = function(){
                if($scope.editMode == true){
                    $scope.editMode = false;
                }else{
                    $scope.editMode = true;
                }
            }

            $rootScope.modUserObj = {
               address: {
                   street: $scope.userInfo.address.street,
                   city: $scope.userInfo.address.city,
                   province: $scope.userInfo.address.province,
                   postalcode: $scope.userInfo.address.postalcode
                   },
               firstname: $scope.userInfo.firstname,
               lastname: $scope.userInfo.lastname,
               email: $scope.userInfo.email,
               photo: $scope.userInfo.photo

            };

            $scope.modCurrentUser = function(){
                getData.modifyUserDetail().success(function(dataResponse){
                    console.log(dataResponse);
                    $state.reload();
                });
            }

        });

    $scope.logout = function(){
        getData.logout().success(function(dataResponse){
            console.log(dataResponse);
            $rootScope.loggedIn = false;
            $rootScope.isAdmin = false;
            $rootScope.username = '';

            $cookies.put('loggedIn', false);
            $cookies.put('isAdmin', false);
            $cookies.put('username', '');

            $state.reload();
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
        $scope.usersList = dataResponse;

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

.controller('cartCtrl', function($scope, $rootScope, $state, $location, getData) {

    getData.getUserCart().success(function(dataResponse){
        console.log(dataResponse);
        $scope.userCart = dataResponse;


        $scope.checkout = function() {
            getData.postCheckout().success(function(dataResponse) {
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

.controller('ordersCtrl', function($scope, $rootScope, $state, $location, getData) {

    getData.getOrders().success(function(dataResponse){
        console.log(dataResponse);
        $scope.ordersList = dataResponse;

    });
})

;
