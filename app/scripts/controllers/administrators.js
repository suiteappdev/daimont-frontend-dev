'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('EmployeesCtrl', function ($scope, modal,  api, storage, $state, $rootScope, $timeout, $stateParams) {
    $scope.Records  = false;
    $scope.records = [];

     $scope.type = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Rol'
    };
      $scope.load = function(){
            api.user().add("employees").get().success(function(res){
                  $scope.records = res || [];
                  $scope.Records  = true;
            });
      }

      $scope.edit = function(){
      	  $scope.formEdit = angular.copy(this.record);
      	  delete $scope.formEdit.password;

	      window.modal = modal.show({templateUrl : 'views/administrators/edit_administrator.html', size:'lg', scope: this, backdrop: 'static', keyboard  : false}, function($scope){
	        	if($scope.formEditAdministrator.$valid){
	        			console.log("SCOPE", $scope);
	        		api.user($scope.formEdit._id).put($scope.formEdit).success(function(res){
	        			if(res){
	                    new NotificationFx({
	                        message : '<p>Registro actualizado.</p>',
	                        layout : 'growl',
	                        effect : 'genie',
	                        type : 'notice', // notice, warning or error
	                        onClose : function() {
	                          
	                        }
	                      }).show();   

	        			  $scope.load();
	          			  $scope.$close();
	        			}
	        		});
	        	}
	      }); 
      }

      $scope.delete = function(){
      	var _record = this.record._id;

            modal.removeConfirm({
                     closeOnConfirm : true,
                     confirmButtonColor: "#008086"
                 },
                     function(isConfirm){ 
                        if (isConfirm) {
				        		api.user(_record).delete().success(function(res){
				        			if(res){
					        			$scope.load();

					                    new NotificationFx({
					                        message : '<p>Registro Borrado.</p>',
					                        layout : 'growl',
					                        effect : 'genie',
					                        type : 'notice', // notice, warning or error
					                        onClose : function() {
					                          
					                        }
					                      }).show();   

					          			  $scope.$close();
				        			}
				        		}); 
                        }
              });
      }

      $scope.create = function(){
	      window.modal = modal.show({templateUrl : 'views/administrators/new_administrator.html', size:'lg', scope: this, backdrop: 'static', keyboard  : false}, function($scope){
	        	if($scope.formAdministrator.$valid){
	        		$scope.form.data.type = 'SUPERVISOR';
	        		$scope.form.data.active = true;

	        		api.user().post($scope.form.data).success(function(res){
	        			if(res){
							new NotificationFx({
		                        message : '<p>Registro Creado.</p>',
		                        layout : 'growl',
		                        effect : 'genie',
		                        type : 'notice', // notice, warning or error
		                        onClose : function() {
		                          
		                        }
	                      }).show();   

	        			   $scope.load();
	          			   $scope.$close();

	        			}
	        		});
	        	}
	      }); 
      }

    $scope.logout = function(){
      window.localStorage.clear();
      delete $rootScope.isLogged;
      delete $rootScope.user;
      window.location.href = "#!/";
    }
  });
