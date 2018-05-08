'use strict';

/**
 * @ngdoc overview
 * @name shoplyApp
 * @description
 * # shoplyApp
 *
 * Main module of the application.
 */
angular
  .module('shoplyApp', [
    'ui.bootstrap',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'firebase',
    'selectize',
    'angularUtils.directives.dirPagination',
    'ngImgCrop',
    'angular-preload-image',
    'jkuri.datepicker',
    'vcRecaptcha',
    'ui.map',
    'facebook',
    'angular.filter'
  ])
  .config(function ($stateProvider, $httpProvider, constants, $urlRouterProvider, FacebookProvider, paginationTemplateProvider, $locationProvider) {
        FacebookProvider.init('448351572192242');
        paginationTemplateProvider.setPath('views/system-utils/pagination.tpl.html');
        $httpProvider.interceptors.push(function($injector, $q, sweetAlert, storage) {
        var rootScope = $injector.get('$rootScope');
        
        return {
            'request': function(config) {
                $httpProvider.defaults.withCredentials = false;
                
                if(window.localStorage.token){
                   $httpProvider.defaults.headers.common['x-daimont-auth'] =  window.localStorage.token ;
                   $httpProvider.defaults.headers.common['x-daimont-user'] =  window.localStorage.uid || null  ; // common
                 }

                 if(window.localStorage.access_token){
                    $httpProvider.defaults.headers.common['access-token'] =  window.localStorage.access_token;
                    $httpProvider.defaults.headers.common['x-daimont-user'] = window.localStorage.user ? angular.fromJson(window.localStorage.user)._id : null // common
                 }
                 
                if(config.method == 'POST'){
                    config.data.metadata = config.data.metadata || {}
                    config.data.metadata._author = window.localStorage.uid || null;
                    
                    if(window.localStorage.access_token){
                        config.data.metadata._provider = 'FACEBOOK'; 
                    } 
                  }
                /*for (var x in config.data) {
                    if (typeof config.data[x] === 'boolean') {
                        config.data[x] += '';
                    }
                }*/

                return config || $q.when(config);
            },
            'response': function(response) {
                return response;

            },
            'responseError': function(rejection) {
              console.log("error", rejection);
                 switch(rejection.status){
                    case 401:
                    if(rootScope.user && rootScope.user.type == "CLIENT" || rejection.data.message == "invalid token"){
                          window.swal({
                                title: "La sesión ha expirado",
                                text: "Tiempo de sesión agotado, por favor ingrese nuevamente",
                                imageUrl:"images/expired.png",
                                allowOutsideClick: false,
                                confirmButtonText: "OK",
                                allowEscapeKey : false
                            }, function(){
                                 window.localStorage.clear();
                                 delete rootScope.isLogged;
                                 delete rootScope.user;

                                 if(window.sweet)
                                    window.sweet.hide();
                                 if(window.modal)
                                    window.modal.close();

                                window.location.href = "#/home";
                            });                      
                    }

                      return $q.reject(rejection);
                    break;

                    default:
                      return $q.reject(rejection);
                    break;
                 }
                
                return $q.reject(rejection);
            }
        };
    });

      $urlRouterProvider.otherwise("/");
      $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'views/home/home.html',
              data: {
                pageTitle: 'Inicio'
              }
          })
          .state('empezar', {
              url: '/empezar',
              templateUrl: 'views/empezar/empezar.html',
              params: {
                      credit: null
              },
              data: {
                pageTitle: 'Empezar'
              }
          })
          .state('home.continuar', {
              url: 'home/continuar',
              templateUrl: 'views/forms/login.html',
              params: {
                credit: null
              },
              data: {
                pageTitle: 'Ingresar y Continuar'
              }
          })
          .state('activation', {
              url: 'activation/:activation',
              templateUrl: 'views/activation/activation.html',
              data: {
                pageTitle: 'Activar Cuenta'
              }
          })
          .state('home.sms', {
              url: 'home/sms',
              templateUrl: 'views/forms/sms-checking.html',
              data: {
                pageTitle: 'Verificando...'
              }
          })
          .state('about', {
              url: '/acercade',
              templateUrl: 'views/aboutus/aboutus.html',
              data: {
                pageTitle: 'Que es Daimont?'
              }
          })
          .state('how', {
              url: '/como-empezar',
              templateUrl: 'views/how-start/how-start.html',
              data: {
                pageTitle: 'Como solicitar un credito?'
              }
          })
          .state('faq', {
              url: '/preguntas-frecuentes',
              templateUrl: 'views/faq/faq.html',
              data: {
                pageTitle: 'FAQ'
              }
          })
          .state('contact', {
              url: '/contacto',
              templateUrl: 'views/contact/contact.html',
              data: {
                pageTitle: 'Contactanos'
              }
          })
          .state('terms', {
              url: '/terminos-condiciones',
              templateUrl: 'views/terms/terms.html',
              data: {
                pageTitle: 'Terminos y condiciones'
              }
          })
          .state('login', {
              url: '/login/:token',
              templateUrl: 'views/login/login.html',
              params : {
                mailed : null,
                user_signed : null,
                token : null
              },
              data: {
                pageTitle: 'Entrar'
              } 
          })
          .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup/signup.html',
                controller:'signupCtrl',
                data: {
                  pageTitle: 'Registrarse'
                }
          })
          .state('profile', {
                url: '/perfil',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/profile.html',
                controller:'profileCtrl',
                params: {
                  credit:null,
                  token: null,
                  contract: null
                },  
                data: {
                  pageTitle: 'Perfil'
                }
          })
          .state('contract', {
                url: '/nuevo-contrato/:credit',
                access: { requiredAuthentication: true },
                templateUrl: 'views/contract/contract.html',
                params: {
                  credit: null,
                },  
                data: {
                  pageTitle: 'Firmar contrato'
                }
          })
          .state('profile.basic', {
                url: '/update/basic',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/basic_info.html',
                controller:'profileCtrl',
                data: {
                  pageTitle: 'Información Basica'
                }
          })
          .state('profile.references', {
                url: '/update/references',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/referencias.html',
                controller:'profileCtrl',
                data: {
                  pageTitle: 'Referencias'
                }
          })
          .state('profile.location', {
                url: '/update/location',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/location_info.html',
                controller:'profileCtrl',
                data: {
                  pageTitle: 'Información residencial'
                }
          })
          .state('profile.finance', {
                url: '/update/finance',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/finance_info.html',
                controller:'profileCtrl',
                data: {
                  pageTitle: 'Información Financiera'
                }
          })
          .state('profile.bank', {
                url: '/update/bank',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/bank_info.html',
                controller:'profileCtrl',
                data: {
                  pageTitle: 'Información Bancaria'
                }
          })
          .state('profile.resumen', {
                url: '/update/resumen',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/resumen.html',
                controller:'profileCtrl',
                data: {
                  pageTitle: 'Resumen de datos'
                }
          })
          .state('recover', {
                url: '/recover',
                templateUrl: 'views/recover/recover.html',
                data: {
                  pageTitle: 'Recuperar clave'
                }
          })
          .state('reset', {
                url: '/account/reset/:token',
                templateUrl: 'views/reset/reset.html',
                data: {
                  pageTitle: 'Cambiar clave'
                }
          })
          .state('dashboard.change-password', {
                url: '/account/change-password',
                access: { requiredAuthentication: false },
                templateUrl: 'views/reset/change_password.html',
                data: {
                  pageTitle: 'Cambiar clave'
                }
          })
          .state('dashboard.new_credit', {
                url: '/nuevo-credito',
                access: { requiredAuthentication: true },
                templateUrl: 'views/credits/new_credit.html',
                params: {
                  with_offer: null
                },   
                data: {
                  pageTitle: 'Nuevo Credito',
                  subtext : "Para solicitar un nuevo préstamo elije el monto y la fecha de pago."
                }
          })
          .state('dashboard.historial', {
                url: '/historial',
                access: { requiredAuthentication: true },
                templateUrl: 'views/historial/historial.html',
                data: {
                  pageTitle: 'Historial de Prestamos',
                  subtext : "Historial de prestamos realizados"
                }
          })
          .state('dashboard.cupo', {
                url: '/cupo',
                access: { requiredAuthentication: true },
                templateUrl: 'views/cupo/cupo.html',
                data: {
                  pageTitle: 'Ampliar cupo de préstamo',
                  subtext : "Formulario para amplicar cupo de préstamo"
                }
          })
          .state('dashboard.profile', {
                url: '/perfil',
                access: { requiredAuthentication: true },
                templateUrl: 'views/profile/profile.html',
                data: {
                  pageTitle: 'Actualizar Perfil',
                  subtext : "Formulario para actualizacion de perfil de préstamo"
                }
          })
          .state('detail', {
                url: '/detail/:credit',
                access: { requiredAuthentication: true },
                templateUrl: 'views/credits/credit_detail.html',
                params: {
                  credit: null
                },        
                data: {
                  pageTitle: 'Detalle del credito'
                }
          })
          .state('pronto_pago', {
                url: '/pronto-pago/:credit',
                access: { requiredAuthentication: true },
                templateUrl: 'views/pronto_pago/pronto_pago.html',
                params: {
                  credit: null
                },        
                data: {
                  pageTitle: 'Pronto pago'
                }
          })
          .state('administrators', {
                url: '/administrators',
                access: { requiredAuthentication: true },
                templateUrl: 'views/administrators/administrators.html',
                data: {
                  pageTitle: 'Empleados'
                }
          })
          .state('plans', {
                url: '/planes',
                access: { requiredAuthentication: true },
                templateUrl: 'views/plan/planes.html',
                data: {
                  pageTitle: 'Planes'
                }
          })
          .state('payments-detail', {
                url: '/payments/:payment',
                access: { requiredAuthentication: true },
                templateUrl: 'views/payments/payments_detail.html',
                params: {
                  payment: null
                },
                data: {
                  pageTitle: 'Detalle del pago'
                }
          })
          .state('payments', {
                url: '/payments',
                access: { requiredAuthentication: true },
                templateUrl: 'views/payments/payments.html',
                params: {
                  payment: null
                },
                data: {
                  pageTitle: 'Pagos'
                }
          })
          .state('credits', {
                url: '/credits/:status',
                access: { requiredAuthentication: true },
                templateUrl: 'views/credits/credits.html',
                params: {
                  status: null
                },
                data: {
                  pageTitle: 'Creditos'
                }
          })
          .state('clients', {
                url: '/clients/:status',
                access: { requiredAuthentication: true },
                templateUrl: 'views/clients/clients.html',
                params: {
                  status: null
                },
                data: {
                  pageTitle: 'Clientes'
                }
          })
          .state('edit_client', {
                url: '/edit-client/:client',
                access: { requiredAuthentication: true },
                templateUrl: 'views/clients/client_edit.html',
                params: {
                  status: null
                },
                data: {
                  pageTitle: 'Editar Cliente'
                }
          })
          .state('launcher', {
                url: '/launcher',
                access: { requiredAuthentication: false },
                templateUrl: 'views/launcher/launcher.html',
                data: {
                  pageTitle: 'Descarga la app'
                }
          })
          .state('dashboard', {
                url: '/dashboard',
                access: { requiredAuthentication: true },
                templateUrl: 'views/dashboard/dashboard.html',
                params: {
                  signed: null,
                  with_offer : null,
                  without_offer : null
                },
                data: {
                  pageTitle: 'Mi Prestamo'
                }
          });
  }).run(["$rootScope", "constants", "storage", "$state","sounds", "api", "$window", "$http", "$timeout", "$location", function($rootScope, constants, storage, $state, sounds, api, $window, $http, $timeout, $location){

      $rootScope.logout = function(){
            window.localStorage.clear();
            delete $rootScope.isLogged;
            window.location.reload();
       }
  

        var forceSSL = function () {
          if ($location.protocol() !== 'https') {
              $window.location.href = $location.absUrl().replace('http', 'https');
          }
        };

        //forceSSL();

        $rootScope.currency = constants.currency;
        $rootScope.base = constants.uploadFilesUrl;
        $rootScope.user = angular.fromJson(storage.get('user'));
        $rootScope.isLogged = storage.get('access_token') || storage.get('token')
        $rootScope.state = $state;
        $rootScope.device = SmartPhone.isAny();
        $rootScope.online = navigator.onLine;
        $rootScope.loader = false;
        $rootScope.loaderText = 'cargando...';


        if((storage.get('access_token') || storage.get('token')) && !storage.get('user')){
          delete localStorage.user;
          delete localStorage.access_token;
          delete localStorage.token;
        }


        $http.get('https://freegeoip.net/json/').success(function(res){
            $rootScope.client_metadata = res || {};
        });

        $window.addEventListener("offline", function() {
          $rootScope.$apply(function() {
            $rootScope.online = false;
          });
        }, false);

        $window.addEventListener("online", function() {
          $rootScope.$apply(function() {
            $rootScope.online = true;
          });
        }, false);

        if(SmartPhone.isAny()){
            $timeout(function(){
              //window.nowuiKit.initRightMenu()
            });
        }

        try{
            window.socket = new io(constants.socket);

            window.socket.on("connect", function(){
                if($rootScope.user){
                    window.socket.emit("MAIN", $rootScope.user._id);
                }
            });

            window.socket.on('CREDIT_UPDATED', function(data){
                Push.create("INFORMACIÓN DE CRÉDITO!", {
                    body: "El estado de tu crédito ha cambiado.",
                    icon: 'images/push-icon.png',
                    timeout: 20000,
                    onClick: function () {
                        $state.go('dashboard', { reload : true });
                        $rootScope.$emit('CREDIT_UPDATED_LOCAL', data);
                        this.close();
                    }
                });
            });

            if($rootScope.user.type =='ADMINISTRATOR'){
                  toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": false,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "20000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                  }

                toastr.options.onclick = function() { 
                    $state.go('detail', { credit : $rootScope.incoming_request._id});
                }

                window.socket.on('NEW_CREDIT_TO_ADMIN', function(data){
                    toastr.success('Prestamo n° ' + data.data.id, 'Nueva solicitud');
                    $rootScope.result_length = ($rootScope.result_length + 1);
                    sounds.onRequest();

                    $rootScope.$emit("NEW_CREDIT_PUSH", data);
                    $rootScope.incoming_request = data;
                    $rootScope.$apply();
                }); 

                window.socket.on('NEW_PAYMENT_TO_ADMIN', function(data){
                    toastr.success('Nuevo Pago');
                    $rootScope.payments_records.push(data);
                    sounds.onRequest();

                    $rootScope.$apply();
                });
            } 

        }catch(e){
          console.log("failed on connection with socket server");
        }

      $rootScope.$on('$stateChangeStart', function(event, nextRoute, toParams, fromState, fromParams){
            if((nextRoute.name  == 'credits'  || nextRoute.name  == 'payments' || nextRoute.name  == 'payments-detail' || nextRoute.name  == 'detail' || nextRoute.name == 'administrators') && ($rootScope.user && $rootScope.user.type == 'CLIENT' || !$rootScope.user.type == 'SUPERVISOR')){
                  nextRoute.data.pageTitle = fromState.data.pageTitle;
                  event.preventDefault();
                  return;
            }

            if(window.modal){
              window.modal.close();
            }
            
            if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !storage.get('token') && !storage.get('access_token') && !$rootScope.user) {
                  event.preventDefault();
                  nextRoute.data.pageTitle = "Entrar";
                  $state.transitionTo('login');
                  return;
            }

            window.scrollTo(0, 0);
      });

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if( SmartPhone.isAny()){
                 if(nowuiKit.misc.navbar_menu_visible == 1) {
                    $('html').removeClass('nav-open');
                   nowuiKit.misc.navbar_menu_visible = 0;
                    setTimeout(function(){
                       $toggle.removeClass('toggled');
                       $('#bodyClick').remove();
                   }, 550);

                } 
        }
      });
  }]);
    