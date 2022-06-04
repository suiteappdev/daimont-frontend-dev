'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:ChangepasswordCtrl
 * @description
 * # ChangepasswordCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('ResetPasswordCtrl', function ($scope, $stateParams, api, sweetAlert, account, storage, $state, modal) {
  	$scope.reset = function(){
        if($scope.resetForm.$valid){
          $scope.form.data.link = $stateParams.token;
        	api.reset_password().add($stateParams.token).post($scope.form.data).then(function(res){
        		if(res){
               $scope.mailed = true;
		           delete $scope.form;
                    modal.confirm({
                           confirmButtonText: "Aceptar",
                           closeOnConfirm : true,
                           title: "Listo",
                           showCancelButton: false,
                           text: "Has cambiando correctamente tu contraseña",
                           confirmButtonColor: "#008086",
                           type: "success" },
                           function(isConfirm){ 
                              if (isConfirm) {
                                  $state.go('login');

                              }
                    });
        		}
        	}, function(data){
        		if(data.status == 404){
              $scope.no_found_or_expired = true;
        		}
        	})
        }
  	}
  });
