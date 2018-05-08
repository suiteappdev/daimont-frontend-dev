'use strict';

angular.module('shoplyApp')
  .controller('historialCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope, $stateParams, $timeout, $http, $window) {
    $scope.Records  = false;
    $scope.records = [];
    $scope.page = 1;
    
    $scope.load = function(){
        api.credits().add('history').get().success(function(res){
            $scope.records = res || [];
            $scope.Records  = true;
        });

        api.credits().add('current').get().success(function(res){
              $scope.current_credit = res;
        });
    }

    $scope.dowmloadCertificate = function(){
         $window.open('https://daimont.com.co:8443/certificate/' + $rootScope.user._id, '_blank');

    }

    $scope.viewContract = function(){
          Handlebars.registerHelper('formatCurrency', function(value) {
              return $filter('currency')(value);
          });

          $http.get('views/prints/contract.html').success(function(res){
                var _template = Handlebars.compile(res);

                var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
                
                w.document.write(_template({}));
                w.print();
                w.close();
          });
    }

    $scope.update = function(){

    }
  });