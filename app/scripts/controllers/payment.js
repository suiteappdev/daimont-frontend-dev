'use strict';

angular.module('shoplyApp')
  .controller('paymentCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope, $stateParams, $timeout) {
    $scope.Records  = false;
    $scope.records = [];

    $scope.load = function(){
    	api.payments().add("all").get().success(function(res){
    		$scope.records = res || [];
        $scope.Records  = true;
    	});

        if($stateParams.payment){
            $scope.payment = $stateParams.payment;
        }
    }

    $scope.show_user_detail = function(){
      $scope.current_payment = this.record;
      
      window.modal = modal.show({templateUrl : 'views/payments/user_detail.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
          
          $scope.$close();
      }); 
    }


    $scope.show_credit_detail = function(){
      var _credit = this.record._credit;

      $state.go('detail', {credit : _credit._id});
    }
 
    $scope.invalidate = function(){
        var _record = this.record;

        window.modal = modal.show({templateUrl : 'views/payments/invalidate.html', size:'lg', scope: this, backdrop: 'static', keyboard  : false}, function($scope){
            if($scope.formInvalidate.$valid){

              api.payments(_record._id).add("/invalidate").add("/" + _record._credit._id).post($scope.form.data).success(function(res){
                if(res){
                    swal("Pago invalidado!", "Has invalidado este pago satifactoriamente.", "success");
                    $scope.$close();
                    $scope.load();
                }
              });
            }
        }); 
    }

    $scope.finishedCredit = function(){
      var _credit = angular.copy(this.record._credit);
      var record = angular.copy(this.record);

       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Quieres dar por finalizado este prestamo?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      _credit.data.status = 'Finalizado';
                        api.credits(_credit._id).put(_credit).success(function(res){
                          $scope.load();
                          swal({
                              title: "Bien Hecho",
                              text: "Credito finalizado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(isConfirm){
                              if(isConfirm){
                                 api.user(record._user._id).add("/allow_cupon").put({}).success(function(response){
                                    $scope.$close();
                                 });                       
                              }
                            });
                        }); 
                   }
        });
    }

    $scope.logout = function(){
      window.localStorage.clear();
      
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('home');
    }


  });