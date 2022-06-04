'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('signupCtrl', function ($scope, account, $state, sweetAlert, storage, Facebook, $rootScope, modal, api, constants) {
  	
    $scope.register = function(){

      var _success = function(data){
        if(data){
           toastr.success('Gracias por Registrarte');
           delete $scope.formRegister;
           $state.go('login');
        }
      };

      var _error = function(data){
        if(data == 409){
            sweetAlert.swal("No se pudo registrar.", "Este email ya esta registrado.", "error");
        }
      };

      if($scope.signup.$valid){
        if($scope.formRegister.data.password != $scope.formRegister.data.confirm_password){
            sweetAlert.swal("Formulario Incompleto.", "las contraseñas no coinciden.", "error");
            return;
        }
        
        account.usuario().register(angular.extend($scope.formRegister.data, {username : $scope.formRegister.data.email})).then(_success, _error);
      
      }else if($scope.signup.$invalid){
            modal.incompleteForm();
      }
  	};


    $scope.login = function(){
        var _success = function(res){
          if(res.user.type == "CLIENT" || res.user.type == "ADMINISTRATOR"){
              var  _user =  res.user;
              var  _token = res.token;
              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);
              $rootScope.isLogged = true;
              $rootScope.user = storage.get('user');
              $state.go(constants.login_state_sucess);          
          }else{
            sweetAlert.swal("Inhabilitado.", "Privilegios son insuficientes.", "error");
            $scope.unprivileged = true;
          }
        };

        var _error = function(res){
            $scope.failed = true;
        };

        account.usuario().ingresar($scope.form.data).then(_success, _error); 
    }

    $scope.$watch('accept_terms', function(o, n){
      if(n){
         $scope.terms_warning = false;
      }

      if(o){
         $scope.terms_warning = false;
      } 
    });

    $scope.register_and_request = function(){
      if($scope.signup.$invalid){
            modal.incompleteForm();
            return;
      }

      var _success = function(data){
        if(data){
            $state.go('login', { user_signed : true});
            $scope.session_start = false;
           //$scope.login();
        }
      };

      var _error = function(data){
        if(data.status == 409){
            $scope.error_mail_registered = true;
            $scope.session_start = false;
             window.scrollTo(0, 0);
          }
      };


      api.user().add("email/" + $scope.formRegister.data.email).get().success(function(data){
        if(data.count  > 0){
            sweetAlert.swal("Correo en uso.", "Este correo ya se encuentra registrado", "error");
        }else{
          if($scope.signup.$valid){
            if($scope.formRegister.data.password != $scope.formRegister.data.confirm_password){
                sweetAlert.swal("Formulario Incompleto.", "Las contraseñas no coinciden.", "error");
                return;
            }

            if($scope.formRegister.data.email != $scope.email_confirm){
                sweetAlert.swal("Formulario Incompleto.", "Los correos no coinciden", "error");
                return;
            }

            $scope.session_start = true;


            if($rootScope.credit){
                var _credit = {};
                _credit.data = $rootScope.credit.data;
                _credit.data.client_metadata = $rootScope.client_metadata || {};
                _credit.data.status = 'Pendiente';
            }



            account.usuario().register(angular.extend($scope.formRegister.data, {username : $scope.formRegister.data.email, credit : _credit || {}})).then(_success, _error);
          }else if($scope.signup.$invalid){
                modal.incompleteForm();
          }           
        }

      }).error(function(err){
        console.log(err);
      });


    }

    $scope.load = function(){
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
          $rootScope.loggedIn = true;
          $scope.me(function(data){
            $rootScope.user = data;
          });
        } else {
          $rootScope.loggedIn = false;
        }
      });
    };

    $scope.me = function(callback) {
      Facebook.api('/me', { "fields" :"id, name, email, first_name, last_name, picture" }, callback);
    };

    $scope.facebook_register = function() {
      var _success = function(data){
        if(data){
            $scope.me(function(response){
              console.log("ME FB", response);
                      $scope.me(function(data){
                        api.user().add("facebook/" + data.id).get().success(function(res){
                            if(res != null){
                                $rootScope.isLogged = true;
                                $rootScope.user = res;
                                storage.save('user', res);
                                $scope.session_start = false;
                                
                                if(!res.data.updated){
                                      $state.go('profile.basic');
                                  }else{
                                      $state.go(constants.login_state_sucess);          
                                  }
                            }
                        });
                      }); 
            });
        }
      };

      var _error = function(data){
        if(data.status == 409){
                      $scope.me(function(data){
                        api.user().add("facebook/" + data.id).get().success(function(res){
                            if(res != null){
                                $rootScope.isLogged = true;
                                $rootScope.user = res;
                                window.localStorage.user = JSON.stringify(res);
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
                    $scope.session_start = true;
                    
                    Facebook.login(function(response) {
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
        var _success = function(res){
          if(res){
              var  _user =  res.user;
              var  _token = res.token;

              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);

              $rootScope.isLogged = true;
              $rootScope.user = _user;

              $state.go('login', { mailed : true});
          }

        };

        var _error = function(res){
            $scope.failed = true;
        };

        account.usuario().ingresar({ email : $scope.formRegister.data.email, password : $scope.formRegister.data.password }).then(_success, _error); 
    }

    $scope.remember = function(remember){
      if(remember && $scope.form.data.email){
        storage.save('rememberEmail', $scope.form.data.email);
      }else{
        storage.delete('rememberEmail');
      }
    }

  });
