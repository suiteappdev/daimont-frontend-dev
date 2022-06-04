'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CreditDetailCtrl', function ($scope, modal,  api, storage, $state, $rootScope, $timeout, $stateParams, $firebaseObject, $firebaseArray, $http, $filter) {
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;
    $scope.new_payment_form = {};
    


    $scope.load = function(){
      if($stateParams.credit){
          api.credits($stateParams.credit).get().success(function(res){
                $scope.credit = res;
                $scope.setCriteriaField();
                var refForArray  = firebase.database().ref(res._id);

                var syncObject = $firebaseObject(refForArray);
                syncObject.$bindTo($scope, "data");
               
                $scope.comments = $firebaseArray(refForArray);

                if(!$scope.credit.data.viewed){
                    api.credits().add("viewed/" + $scope.credit._id).put({}).success(function(response){
                          console.log("response", response);
                    });                  
                }

                if($scope.credit.data.viewedPreventivo){
                    api.credits().add("unset-viewed-preventivo/" + $scope.credit._id).put({}).success(function(response){
                        console.log("response", response);
                    });              
                }

                api.payments().add("user/" + $scope.credit._user._id).get().success(function(res){
                    $scope.payments_recordsDetails = res || []
                }); 
                
                api.credits().add("finalizado/" + res._user._id + "/count").get().success(function(res){
                  $scope.count = res;
                });

                $scope.early_payment();
                $scope.early_payment_30_days();
                
                $scope.lock_credit  = $scope.credit.data.locked_time ? true : false;
                
                var user_payday = moment($scope.credit.data.pay_day);
                var server_date = moment($scope.credit.data.server_date);

                $scope.payday_30days = moment( $scope.credit.data.deposited_time_server || $scope.credit._contract.createAt).add(30, "days");

                console.log("dias de intereses", (30 - user_payday.date()));
                console.log("dias agregados",  user_payday.add((30 - user_payday.date()), 'days').format("LLL"));

                $scope.final_expiration_date = user_payday.add((30 - user_payday.date()), 'days'); 
                $scope.final_expitation_text = $scope.final_expiration_date.format('MMMM DD, YYYY');
                $scope.margin_expiration_date = user_payday.add((30 - user_payday.date() + 5 ), 'days');

                $scope.freeze_values = moment($scope.credit.data.server_date).isBetween($scope.final_expiration_date, $scope.margin_expiration_date); 

                if(server_date.isAfter(user_payday)){
                    $scope.expired = true;
                }else if(server_date.isAfter($scope.final_expiration_date)){
                    $scope.expired_30days = true;
                    $scope.expired = false;
                }

                $scope.date_expired = user_payday; 
          });

      }
    }

    $scope.consultado = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Desea cambiar este crédito a estado consultado?",
               confirmButtonColor: "#008086",
               type: "warning" },
               function(isConfirm){ 
                   if (isConfirm) {
                      api.credits().add("consultado/" + $scope.credit._id).put($scope.credit).success(function(res){
                        if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Estado cambiado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'consultado'})
                            });
                        }
                      }); 
                   }
        });
    }

  $scope.setVistoPreventivo = function(){
    $scope.credit.data.viewedPreventivo = $scope.credit.data.viewedPreventivo ? false : true;
    
    if($scope.credit.data.viewedPreventivo){
        api.credits().add("set-viewed-preventivo/" + $scope.credit._id).put({}).success(function(response){
            console.log("response", response);
        });  

        console.log("SET PREVENTIVO");
    }else{
        api.credits().add("unset-viewed-preventivo/" + $scope.credit._id).put({}).success(function(response){
            console.log("response", response);
        }); 

        console.log("UNSET PREVENTIVO");
    }
  }

    $scope.setCriteriaField = function(){
      if($scope.credit){
          $scope.credit.creiteria = (($scope.credit._user.name || '') +' '+ ($scope.credit._user.data.second_name || '') +' '+ ($scope.credit._user.last_name || '') +' '+ ($scope.credit._user.data.second_last_name || '')).toString().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/\s\s/g, " ").toUpperCase();
      }
    }

 $scope.totalizePayment_30_day = function(){
      $scope.paymentForm_30_day.total_payment = (parseInt($scope.credit.data.amount[0])) + ($scope.paymentForm_30_day.interestsDays) + ($scope.paymentForm_30_day.system_quote || 0) + ($scope.paymentForm_30_day.iva || 0);
    }

    $scope.early_payment_30_days = function(){
      $scope.paymentForm_30_day = {};

      $scope.payForDays_30  = 30
      $scope.paymentForm_30_day.interests = (parseInt($scope.credit.data.amount[0]) * (2.18831289 / 100));
      $scope.paymentForm_30_day.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays_30);
      $scope.paymentForm_30_day.iva = $scope.paymentForm_30_day.system_quote * (19 / 100);
      
      $scope.paymentForm_30_day.interestsPeerDays = ( angular.copy($scope.paymentForm_30_day.interests) / 30 );
      $scope.paymentForm_30_day.interestsDays = ($scope.paymentForm_30_day.interestsPeerDays ) * $scope.payForDays_30;

      $scope.totalizePayment_30_day();   
    }


    $scope.addComment = function(keyEvent){
        if (keyEvent.which === 13){
              if($scope.editItem){
                  $scope.editItem.comment = $scope.comment;
                  $scope.editItem.createAt = firebase.database.ServerValue.TIMESTAMP;

                  $scope.comments.$save($scope.editItem);
                  delete $scope.editItem;
                  delete $scope.comment;

            }else{
              $scope.comments.$add({
                  user: $rootScope.user.name,
                  comment : $scope.comment,
                  createAt : firebase.database.ServerValue.TIMESTAMP
              });

              delete $scope.comment;              
            }
        }
    };

    $scope.contract = function(){
        console.log("this contract", this)

        var _self = this.paymentRecord;

        $http.get('views/utils/contract.ejs').success(function(res){
          var _template = ejs.render(res, { _data : { 
                nombre : _self._user.name + ' ' +_self._user.last_name,
                email : _self._user.email,
                telefono : _self._user.data.phone || 'sin telefono',
                cedula : _self._user.cc,
                ciudad : _self._user.data.ciudad,
                direccion : _self._user.data.direccion,
                dias : _self._credit.data.days[0],
                fecha_vencimiento : moment(new Date(_self._credit.data.pay_day)).format('MMMM DD, YYYY'),
                fecha_actual :  moment(new Date()).format('MMMM DD YYYY, h:mm:ss a'),
                interes :$filter('currency')(_self._credit.data.interestsDays),
                monto : $filter('currency')(_self._credit.data.amount[0]),
                total : $filter('currency')(_self._credit.data.total_payment),
                cupon : $filter('currency')(_self._user.data.cupon),
                ip:_self._credit.data.client_metadata.ip || 'no definida',
                codigo:_self._credit._contract.data.contract,
                consecutivo:_self._credit.data.id
          }});

          var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
          
          w.document.write(_template);
          w.print();
          w.close();
      });
    }


    $scope.lock = function(){
      if($scope.lock_credit){
         modal.confirm({
                 closeOnConfirm : true,
                 title: "Está Seguro?",
                 text: "Confirma que desea  bloquear los intereses de este préstamo ?",
                 confirmButtonColor: "#008086",
                 type: "warning" },
                 function(isConfirm){ 
                     if (isConfirm) {
                        api.credits().add("lock/" + $scope.credit._id).put($scope.credit).success(function(res){
                          if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Intereses bloqueados correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            });
                          } 
                        });
                     }else{
                          $scope.lock_credit = false;
                          $scope.$apply();
                     }

          });
      }else{
         modal.confirm({
                 closeOnConfirm : true,
                 title: "Está Seguro?",
                 text: "Confirma que desea  habilitar los intereses de este préstamo ?",
                 confirmButtonColor: "#008086",
                 type: "warning" },
                 function(isConfirm){ 
                     if (isConfirm) {
                        api.credits().add("unlock/" + $scope.credit._id).put($scope.credit).success(function(res){
                          if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Intereses habilitados correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            });
                          } 
                        });
                     }else{
                          $scope.lock_credit = true;
                          $scope.$apply();
                     }
          }); 
      }
    }

    $scope.deleteComment = function(){
         var _comment = this.comment;

         modal.confirm({
                 closeOnConfirm : true,
                 title: "Está Seguro?",
                 text: "Confirma que desea  eliminar este comentario ?",
                 confirmButtonColor: "#008086",
                 closeOnConfirm: true,
                 type: "warning" },
                 function(isConfirm){ 
                     if (isConfirm) {
                            firebase.database().ref($scope.credit._id).child(_comment.$id).remove();
                     }
          }); 
    }

    $scope.editComment = function(){
      $scope.editItem = this.comment;
      $scope.comment = $scope.editItem.comment;
    }

    $scope.setFirmado = function(){
          var _credit = angular.copy($scope.credit);

         modal.confirm({
                 closeOnConfirm : true,
                 title: "Está Seguro?",
                 text: "Confirma que desea enviar este préstamo a estado firmado?",
                 confirmButtonColor: "#008086",
                 type: "warning" },
                 function(isConfirm){ 
                     if (isConfirm) {
                         _credit.data.status = 'Firmado';
                        api.credits(_credit._id).put(_credit).success(function(res){
                          if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Has enviado este préstamo a la sección firmados.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(isConfirm){
                              $state.go('credits', { status : "firmado" } );
                            });
                          }
                        }); 
                     }
          }); 
    }

    $scope.now = new Date();

    $scope.update_cupon = function(){
      $scope.user = angular.copy($scope.credit._user);

      window.modal = modal.show({templateUrl : 'views/credits/update_cupon.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
          api.user($scope.user._id).add("/update-cupon").put({cupon : $scope.user.data.cupon}).success(function(response){
              if(response){
                 swal("Cupo actualizado!", "Has modificado este cupo correctamente", "success");
                api.user($scope.user._id).add("/allow_cupon").put({}).success(function(response){ });   
                 $scope.$close();
                 $scope.load();
              }
          });
      }); 
    }

    $scope.finished = function(){
      var _credit = angular.copy($scope.credit);

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
                          if(res){
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
                               $scope.load();
                            });
                          }
                        }); 
                   }
        });
    }

    $scope.$watch('new_date_payment', function(o, n){
      if(n){
          $scope.early_payment();
      };

      if (o) {
          $scope.early_payment();
      };
    });

    $scope.early_payment = function(){
      $scope.mora = {};
      
      console.log("new date", $scope.new_date_payment);

      // system es la varibale que contiene la fecha de deposito.
      var system = moment($scope.credit.data.deposited_time);

      if($scope.new_date_payment){
          var now = moment($scope.new_date_payment, "DD-MM-YYYY");
      }else{

          if($scope.credit.data.status == 'Finalizado'){
            var now = moment($scope.credit._payment[0].createdAt);
            $scope.freez = true;
          }else{
                var now = moment(new Date());
                $scope.freez = false;
          }
      }

      //variable que contiene los dias de intereses
      $scope.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');

      $scope.mora.interests = (parseInt($scope.credit.data.amount[0]) * (2.18831289 / 100));

      $scope.mora.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays);
      $scope.mora.iva = $scope.mora.system_quote * (19 / 100);
      
      $scope.mora.interestsPeerDays = ( angular.copy($scope.mora.interests) / 30 );
      $scope.mora.interestsDays = ($scope.mora.interestsPeerDays ) * $scope.payForDays;
      
      $scope.totalizePayment();        

    }

    $scope.totalizePayment = function(){
      $scope.mora.total_payment = (parseInt($scope.credit.data.amount[0])) + ($scope.mora.interestsDays) + ($scope.mora.system_quote || 0) + ($scope.mora.iva || 0);
    }

    $scope.upload_consignacion_bancaria = function(){
        $scope.payment_type = 'Consignación';
        $('#consignacion_bancaria').click();
    }


    $scope.upload_transacion_bancaria = function(){
          $scope.payment_type = 'Transferencia';
          $('#transaccion_bancaria').click();
    } 

    $scope.new_payment = function(cb){
      $scope.new_payment_form.data = $scope.mora;
      $scope.new_payment_form.data.fromAdmin = true;
      $scope.new_payment_form.data.payment_type = $scope.payment_type;
      $scope.new_payment_form.data.bank = $rootScope.bank_obj;
      $scope.new_payment_form._credit = $scope.credit._id;
      $scope.new_payment_form._user = $scope.credit._user._id;

      if($scope.tipo_pago == "Abono"){
         $scope.new_payment_form.data.tipo_pago = "Abono";
      }else{
         $scope.new_payment_form.data.tipo_pago = "Finalizado";
      }

      console.log("paymentForm", $scope.new_payment_form);

      api.payments().add("update_payment_admin").post($scope.toFormData($scope.new_payment_form), {
        transformRequest: angular.identity,
        headers: {'Content-Type':undefined, enctype:'multipart/form-data'}
        }).success(function(res){
              if(res){

                  $scope.credit._payment = $scope.credit._payment || [];
                  $scope.credit._payment.push(res._id);
                  $scope.credit._user = $scope.credit._user._id;
                  $scope.credit._contract = $scope.credit._contract ? $scope.credit._contract._id : null;

                  if($scope.tipo_pago == "Abono"){
                      $scope.credit.data.status = 'Consignado';
                  }else{
                      $scope.credit.data.status = 'Finalizado';
                  }

                api.credits($scope.credit._id).put($scope.credit).success(function(response){
                    if(response){
                      $scope.load();
                      cb();
                    }
                });

              }
        });
    } 

    $scope.approve = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que desea aprobar este credito?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                   		$scope.credit.data.status = 'Aceptado';
                      $scope.credit._approvedby = $rootScope.user._id;
            						api.credits().add("approved/" + $scope.credit._id).put($scope.credit).success(function(res){
            							if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito aprobado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'firmado'})
                            });
            							}
            						}); 
                   }
        });
    }

    $scope.preapprove = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que desea pre-aprobar este credito?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      $scope.credit.data.status = 'Preaprobado';
                      $scope.credit._approvedby = $rootScope.user._id;
                        api.credits().add("preapproved/" + $scope.credit._id).put($scope.credit).success(function(res){
                          if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito pre-aprobado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'preaprobado'})
                            });
                          }
                        }); 
                   }
        });
    }

    $scope.fraude = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que desea cambiar el estado a fraude este credito?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      $scope.credit.data.status = 'Fraude';
                        api.credits().add("fraude/" + $scope.credit._id).put($scope.credit).success(function(res){
                          if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito actualizado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'fraude'})
                            });
                          }
                        }); 
                   }
        });
    } 

    $scope.dificil_recaudo = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que desea cambiar el estado a dificil recaudo de este credito?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      $scope.credit.data.status = 'Dificil_recaudo';
                        api.credits().add("dificil_recaudo/" + $scope.credit._id).put($scope.credit).success(function(res){
                          if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito actualizado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'dificil_recaudo'})
                            });
                          }
                        }); 
                   }
        });
    } 

    $scope.toFormData = function(obj, form, namespace) {
        var fd = form || new FormData();
        var formKey;
        
        for(var property in obj) {
          if(obj.hasOwnProperty(property) && obj[property]) {
            if (namespace) {
              formKey = namespace + '[' + property + ']';
            } else {
              formKey = property;
            }
           
            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
              fd.append(formKey, obj[property].toISOString());
            }
            else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
              $scope.toFormData(obj[property], fd, formKey);
            } else { // if it's a string or a File object
              fd.append(formKey, obj[property]);
            }
          }
        }
        
        return fd;
    }

    $scope.done = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que ha transferido el monto a este cliente ?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      $scope.credit.data.status = 'Consignado';
                      $scope.credit._approvedby = $rootScope.user._id;
                      $scope.credit.data.deposited_time = new Date().toISOString();
                      
          						api.credits().add("deposited/" + $scope.credit._id).put($scope.credit).success(function(res){
          							if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito Finalizado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'consignado'})
                            });
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

    $scope._references_family_onWhatsApps = function(){
      $scope.credit._user.data._family_references_onWhatsApps = $scope.credit._user.data._family_references_onWhatsApps ? false : true;
      if($scope.credit._user.data._family_references_onWhatsApps){
          api.credits().add("request/familiy-references-whatsapps/" + $scope.credit._user._id + "/enable").put().success(function(res){
            console.log("references", true);
          });
      }else{
          api.credits().add("request/familiy-references-whatsapps/" + $scope.credit._user._id + "/disabled").put().success(function(res){
            console.log("references", false);
          });
      }
    }

    $scope._references_family_onPhone = function(){
      $scope.credit._user.data._family_references_onPhone = $scope.credit._user.data._family_references_onPhone ? false : true;

      if($scope.credit._user.data._family_references_onPhone){
          api.credits().add("request/family-references-phone/" + $scope.credit._user._id + "/enable").put().success(function(res){

          });
      }else{
          api.credits().add("request/family-references-phone/" + $scope.credit._user._id + "/disabled").put().success(function(res){

          });
      }

    }

    $scope._references_comercial_onWhatsApps = function(){
      $scope.credit._user.data._comercial_references_OnWhatsapps = $scope.credit._user.data._comercial_references_OnWhatsapps ? false : true;
      if($scope.credit._user.data._comercial_references_OnWhatsapps){
          api.credits().add("request/comercial-references-whatsapps/" + $scope.credit._user._id + "/enable").put().success(function(res){
            console.log("references", true);
          });
      }else{
          api.credits().add("request/comercial-references-whatsapps/" + $scope.credit._user._id + "/disabled").put().success(function(res){
            console.log("references", false);
          });
      }
    }

    $scope._references_comercial_onPhone = function(){
      $scope.credit._user.data._comercial_references_onPhone = $scope.credit._user.data._comercial_references_onPhone ? false : true;

      if($scope.credit._user.data._comercial_references_onPhone){
          api.credits().add("request/comercial-references-phone/" + $scope.credit._user._id + "/enable").put().success(function(res){

          });
      }else{
          api.credits().add("request/comercial-references-phone/" + $scope.credit._user._id + "/disabled").put().success(function(res){

          });
      }

    }

   $scope.reject = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Confirma que rechaza el credito de este cliente?",
               confirmButtonColor: "#008086",
               type: "warning" },
               function(isConfirm){ 
                   if (isConfirm) {
                      api.credits().add("rejected/" + $scope.credit._id).put($scope.credit).success(function(res){
                        if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito rechazado.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'rechazado'})
                            });
                        }
                      }); 
                   }
        });
    }

   $scope.nulled = function(){
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Desea anular este préstamo?",
               confirmButtonColor: "#008086",
               type: "warning" },
               function(isConfirm){ 
                   if (isConfirm) {
                      api.credits().add("nulled/" + $scope.credit._id).put($scope.credit).success(function(res){
                        if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Credito anulado.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                                $state.go('credits', {status : 'firmado'})
                            });
                        }
                      }); 
                   }
        });
    }

    $scope.update_payment = function(){
      window.modal = modal.show({templateUrl : 'views/credits/update_payment.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
          $scope.new_payment(function(){
            swal("Pago Enviado!", "Has enviado la evidencia de pago correctamente.", "success");
              $scope.$close()
          });
      }); 
    } 
  });
