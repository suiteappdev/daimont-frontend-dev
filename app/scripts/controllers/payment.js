'use strict';

angular.module('shoplyApp')
  .controller('paymentCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope, $stateParams, $timeout) {
    $scope.Records  = false;
    $scope.records = [];
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;

    $scope.load = function(){
    	api.payments().add("all").get().success(function(res){
    		$scope.records = res || [];
        $scope.Records  = true;
    	});

        if($stateParams.payment){
            $scope.payment = $stateParams.payment;
        }
    }

    $scope.early_payment = function(){
      // system es la varibale que contiene la fecha de deposito.
      $scope.mora = {};

      var system = moment(this.record._credit.data.deposited_time);
      var now   = moment(new Date());

      //variable que contiene los dias de intereses
      $scope.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');
      $scope.mora.interests = (parseInt(this.record._credit.data.amount[0]) * (2.18831289 / 100));
      $scope.mora.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays);
      $scope.mora.iva = $scope.mora.system_quote * (19 / 100);
      
      $scope.mora.interestsPeerDays = ( angular.copy($scope.mora.interests) / 30 );
      $scope.mora.interestsDays = ($scope.mora.interestsPeerDays ) * $scope.payForDays;
      
      $scope.totalizePayment(this.record);
      this.record.data.early_payment  = $scope.mora; 

    }

    $scope.totalizePayment = function(record){
      $scope.mora.total_payment = (parseInt(record._credit.data.amount[0])) + ($scope.mora.interestsDays) + ($scope.mora.system_quote || 0) + ($scope.mora.iva || 0);
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

    $scope.finishedAbono = function(){
      var _credit = angular.copy(this.record._credit);
      var record = angular.copy(this.record);

       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirmar Abono?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                          record.data.paymentDone = true;
                          api.payments(record._id).put(record).success(function(res){
                            $scope.load();
                            swal({
                                title: "Bien Hecho",
                                text: "Abono recibido correctamente.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#008086",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                              },
                              function(isConfirm){
                                if(isConfirm){
                          
                                }
                              });
                          }); 
                          swal({
                              title: "Bien Hecho",
                              text: "Abono recibido correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(isConfirm){
                              if(isConfirm){
                        
                              }
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