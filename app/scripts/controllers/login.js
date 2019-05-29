'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('LoginCtrl', function ($scope, sweetAlert, constants, $state, storage, account, $rootScope, Facebook, $stateParams, modal, api) {
  	$scope.load = function(){
      $scope.mailed = $stateParams.mailed || null;
      $scope.user_signed = $stateParams.user_signed || null;
      
      delete $scope.form;

      if($stateParams.token){
            api.user().add('activate/').post({ activation_token : $stateParams.token }).success(function(res){
                if(res){
                    $scope.activated = true;
                }
            });   
      }
      
      if(storage.get("rememberEmail")){
        $scope.fromStore = true;
        $scope.form = {};
        $scope.form.data = {};
        $scope.form.data.email = storage.get("rememberEmail");
      }
  	}

    $scope.$watch(function() {
      return Facebook.isReady();
    }, function(newVal) {
      $scope.facebookReady = true;
    });

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $rootScope.isLogged = true;
          
          $scope.me(function(data){
            $rootScope.user = data;
            storage.save('uid', data.id.toString());
          });
        } else {
          $rootScope.isLogged = false;
        }
      });
    };

    $scope.me = function(callback) {
      Facebook.api('/me', { "fields" :"id, name, email, first_name, last_name, picture" }, callback);
    };

    $scope.facebook_login = function() {
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que desea pedir este credito?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                        Facebook.login(function(response) {
                          if(response.status == 'connected'){
                              console.log("token", response.authResponse.accessToken);
                              var fb_token = response.authResponse.accessToken;
                              storage.save('access_token', fb_token.toString());
                              $scope.me(function(data){
                                 var new_user = {};
                                     new_user.data = {};
                                     new_user.metadata  = {};
                                     new_user.metadata._author  = data.id;
                                     new_user.name = data.first_name;
                                     new_user.last_name = data.last_name;
                                     new_user.data.facebook_id = data.id;
                                     new_user.email = data.email;
                                     
                                     $rootScope.isLogged = true;
                                     $rootScope.user = new_user;
                                     $rootScope.loggedIn = true;

                                     storage.save('uid', data.id);
                                     storage.save('user', new_user);

                                     if($rootScope.signed){
                                        delete $rootScope.signed;
                                     }

                                     $state.go(constants.login_state_sucess); 

                              });          
                          }

                        }, { scope:'email' } );   
                   }
        });
    };

    $scope.facebook_login_default = function() {
      if(localStorage.getItem('access_token')){
          $state.go(constants.login_state_sucess);
          return;
      }

      var _success = function(data){
            $scope.me(function(response){
              console.log("ME FB", response);
                      $scope.me(function(data){
                        api.user().add("facebook/" + data.id).get().success(function(res){
                            if(res != null){
                                $rootScope.isLogged = true;
                                $rootScope.user = res;
                                localStorage.user = JSON.stringify(res);
                               
                                $scope.session_start = false;
                                
                                if(!res.data.updated){
                                      $state.go('profile.basic');
                                  }else{
                                     if($rootScope.signed){
                                        delete $rootScope.signed;
                                     }
                                     
                                     $state.go(constants.login_state_sucess);          
                                  }
                            }
                        });
                      }); 
            });
      };

      var _error = function(data){
        if(data.status == 409){
              $scope.me(function(data){
                console.log("/me", data)
                api.user().add("facebook/" + data.id).get().success(function(res){
                  console.log("user", res)
                    if(res != null){
                        $rootScope.isLogged = true;
                        $rootScope.user = res;
                         window.localStorage.setItem('user', JSON.stringify(res));
                        $scope.session_start = false;
                        if(!res.data.updated){
                              $state.go('profile.basic');
                        }else{
                          $state.go(constants.login_state_sucess);
                        }
                    }
                });
              });   
          }
      };
                    Facebook.login(function(response) {
                      $scope.session_start = true;

                      if(response.status == 'connected'){
                          console.log("RESPONSE FB", response);
                          console.log("token", response.authResponse.accessToken);
                          var fb_token = response.authResponse.accessToken;

                          window.localStorage.setItem('access_token', fb_token);

                          $scope.me(function(data){
                                    var new_user = {};
                                    new_user.data = {};
                                    new_user.metadata  = {};
                                    new_user.data._provider = 'FACEBOOK';
                                    new_user.data.facebookId  = data.id;
                                    new_user.name = data.first_name;
                                    new_user.type = 'CLIENT';
                                    new_user.data.picture = data.picture.data.url;
                                    new_user.last_name = data.last_name;
                                    new_user.email = data.email;
                            
                                      if($rootScope.credit){
                                          var _credit = {};
                                          _credit.data = $rootScope.credit.data;
                                          _credit.data.client_metadata = $rootScope.client_metadata || {};
                                          _credit.data.status = 'Pendiente';
                                          new_user.credit = _credit;
                                      }

                                    account.usuario().register(new_user).then(_success, _error);  

                                    $scope.$apply();
                          });  
                      }else{
                          $scope.session_start = false;
                      }

                    }, { scope:'email' } );   
    };

  	$scope.login = function(){
  		if($scope.loginForm.$invalid){
            modal.incompleteForm();
            return;
      }

      $scope.session_start = true;
      delete $scope.user_signed;

        var _success = function(res){
          if(res.user.type == "CLIENT"){
              var  _user =  res.user;
              var  _token = res.token;
              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);
              $rootScope.isLogged = true;
              $rootScope.user = storage.get('user');
              $scope.session_start = false;

              delete $scope.user_signed;
              delete $scope.invalid_data;

              if(!res.user.data.updated){
                  $state.go('profile.basic');
              }else{
                  if($rootScope.signed){
                      delete $rootScope.signed;
                   }

                  $state.go(constants.login_state_sucess);          
              }

          }else if(res.user.type == "ADMINISTRATOR"){
              var  _user =  res.user;
              var  _token = res.token;
              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);
              $rootScope.isLogged = true;
              $rootScope.user = storage.get('user');
              $state.go("credits", { status : 'firmado' });          
          }else if(res.user.type == "SUPERVISOR"){
              var  _user =  res.user;
              var  _token = res.token;
              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);
              $rootScope.isLogged = true;
              $rootScope.user = storage.get('user');
              $state.go("credits", { status : 'firmado' }); 
          }else{
            sweetAlert.swal("Inhabilitado.", "Privilegios son insuficientes.", "error");
            $scope.unprivileged = true;
          }
        };

        var _error = function(data){
          console.log("error login", data);
          $scope.session_start = false;

          if(data.status == 401 && data.data.blocked_days_to_left){
              $scope.blocked_days_to_left = data.data.blocked_days_to_left;
              return
          }          

          if(data.status == 401 && data.data.blocked){
              $scope.blocked = true;
              return
          }

           if(data.status == 401){
              $scope.invalid_data = true;
              delete $scope.user_signed;
          }

           if(data.status == 404){
              $scope.email_no_exist = true;
              delete $scope.user_signed;
          }
        };

        account.usuario().ingresar($scope.form.data).then(_success, _error); 
  	}

    $scope.login_request = function(){
      if($scope.loginForm.$invalid){
            modal.incompleteForm();
            return;
      }

     modal.confirm({
             closeOnConfirm : true,
             title: "Está Seguro?",
             text: "Confirma que desea realizar este credito?",
             confirmButtonColor: "#008086",
             type: "success" },
             function(isConfirm){ 
                 if (isConfirm) {
                      if($scope.loginForm.$valid){
                        $scope.$parent.$parent.form.data.status = 'Pendiente';
                        $scope.login();
                      
                      }else if($scope.login.$invalid){
                        modal.incompleteForm();
                      } 
                 }
              })
    }

    $scope.logout = function(){
      window.localStorage.clear();
      
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('home');
    }

    $scope.remember = function(remember){
      if(remember && $scope.form.data.email){
        storage.save('rememberEmail', $scope.form.data.email);
      }else{
        storage.delete('rememberEmail');
      }
    }

    $scope.offlineModeWeb = function(){
      if($scope.modeForm.$invalid){
            modal.incompleteForm();
            return;
      }

       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "¿quieres cambiar la disponibilidad de la web ?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      api.system().add(($rootScope.system ? ($rootScope.system._id) : "")).put({ status : ($scope.form.data.mode == "Mantenimiento" ? false : true ) }).success(function(res){
                        if(res.ok == 1){
                            swal({
                                title: "Bien Hecho",
                                text: "La pagina se encuentra en linea.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#008086",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                              });
                        }
                      });
                    }
               });
  } 
  });
