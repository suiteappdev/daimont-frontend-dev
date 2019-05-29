'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('DashboardCtrl', function ($scope, modal,  api, storage, $state, $rootScope, $timeout, $http, $stateParams, $filter) {
    $scope.current_date = new Date();
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;

    $scope.items_tasks = [];
    $scope.records = [];
    $scope.Records  = false;
    $scope.have_contract = false;
    $scope.is_transfered = false;

      $scope.banks = [
        {name : 'Bancolombia', img : 'images/bancolombia.png', account:'08280125459', nit:'901091741', owner:'DAIMONT S.A.S.', type:'Ahorros' },
        {name : 'Davivienda', img : 'images/davivienda.png', account:'206000722424', owner:'LINA CONCEPCION PENATES CHIMA', cc:'1100690755', type:'Ahorros'},
        {name : 'Banco BBVA', img : 'images/bbva.png', account:'488011560', nit:'9010917417', owner:'DAIMONT SAS', type:'Corriente' },
        {name : 'Banco de Bogotá', img : 'images/bogota.png', account:'592622575', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' },
        {name : 'Banco Colpatria', img : 'images/colpatria.png', account:'9362004758', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' }
     
      ]  

    $scope.disableSliderControls = function(){
      $timeout(function(){
        if($rootScope.user.data.cupon == 100000){
            var origins  = $scope.amount_instance_md.target.getElementsByClassName('noUi-origin');
            origins[0].setAttribute('disabled', true);

            var origins_mv  = $scope.amount_instance_mv.target.getElementsByClassName('noUi-origin');
            origins_mv[0].setAttribute('disabled', true);
        }
      });       
    }

    $scope.setBank = function(){
        $rootScope.bank_selected = true;
        var bank = angular.copy(this.bank);
        delete bank.$$hashKey;

        $rootScope.bank_obj = bank;
        
        if($rootScope.signed){
          delete $rootScope.signed;
        }

        $rootScope.hide_note = true;
    }

    api.user().add("banned_time/" + $rootScope.user._id).get().success(function(res){
          if(res.time_to_left < 60){
              $rootScope.showBanned = res.time_to_left;
          }
    }); 

    if(($rootScope.user) && ($rootScope.user.type == 'CLIENT') && (!$rootScope.user.data || !$rootScope.user.data.updated)){
          $state.go("profile.basic");
          return;
    }else if($rootScope.user.type == 'ADMINISTRATOR'){
          $state.go("credits", { status : "firmado" });
          return;
    }

    $rootScope.$on('CREDIT_UPDATED_LOCAL', function(evt, data){
      $scope.load();
      delete $rootScope.signed;
    });

    $scope.load = function(){
      $scope.current_credit = null;
      $rootScope.showBanned = null;
      $scope.with_offer = null;
      $rootScope.isAllowed  = !$rootScope.user.data.cupon_updated || true;
      $rootScope.hide_cupo_menu  = $rootScope.user.data.cupon_updated || false;

      api.user($rootScope.user._id).get().success(function(res){
          if(res){
              if(res.data.cupon != $rootScope.user.data.cupon){
                  $rootScope.user.data.cupon = res.data.cupon;
                  localStorage.user = JSON.stringify(res);
                  $scope.$apply();
              }
          }
      });

      if($rootScope.user){
          window.socket.emit("MAIN", $rootScope.user._id);
      }

      if($stateParams.signed){
            $scope.signed = true;
            delete $scope.without_offer;
      }

      if($stateParams.with_offer){
            $scope.with_offer = true;
      }

      api.credits().add('current').get().success(function(res){
            $scope.Records  = true;

            if(res.expired_request){
                swal({
                  title: "Préstamo caducado",
                  text: "Tu solicitud de préstamos # "+ res.id +" ha caducado. por favor realiza una nueva solicitud.",
                  type: "warning",
                  confirmButtonColor: "#008086",
                  closeOnConfirm: false
                },
                function(){
                  $state.go("dashboard.new_credit");
                  sweetAlert.close();
                });
              
              return
            }
            
            $scope.records = res.length == 0 || res.data.with_offer ? [] : [res];
            $scope.current_credit = $scope.records[0] || undefined; 
            if($scope.current_credit){
                $scope.have_contract = $scope.current_credit._contract || false;
                $scope.is_transfered = ($scope.current_credit.data.status == 'Consignado');
                $scope.deleted = ($scope.current_credit.data.status =='Pagado') || ($scope.current_credit.data.status =='Firmado') || ( $scope.current_credit.data.status =='Consignado') || ( $scope.current_credit.data.status =='Rechazado') ;
                
                var user_payday = moment($scope.current_credit.data.pay_day);
                var server_date = moment($scope.current_credit.data.server_date);

                if($scope.current_credit.data.deposited_time_server){
                    $scope.expiredate = moment($scope.current_credit.data.deposited_time_server).add(30, "days");
                    $scope.expiredateText = $scope.expiredate.format("LL");
                    $scope.margin_expiration_date = $scope.expiredate.add(5, 'days');
                    $scope.freeze_values = moment($scope.current_credit.data.server_date).isBetween($scope.expiredate, $scope.margin_expiration_date); 
                }

                if(server_date.isAfter(user_payday)){
                    $scope.expired = true;
                }else if($scope.current_credit.data.deposited_time_server && (server_date.isAfter($scope.expiredate))){
                    $scope.expired_30days = true;
                    $scope.expired = false;
                }

                $scope.date_expired = user_payday;

            }else{
                $scope.deleted = true;
                if($scope.with_offer){
                  $state.go('dashboard.new_credit');
                }else{
                    $state.go('dashboard');
                }

                $scope.$apply();

                return;
            }

            if($scope.current_credit){
                $scope.early_payment();
                $scope.early_payment_30_days();
            }
      }).error(function(){
        $scope.Records = true;
        $scope.records.length = 0;
      });

      api.payments().get().success(function(res){
            $scope.payments = res || [];  
      });
        try{
              $scope.form.data.pay_day = $scope.pay_day($scope.form.data.days[0]).toISOString();
        }catch(e){
          
        }

    }

    api.credits().add("max_amount").get().success(function(res){
          $scope.cupon = res || [];
      }).error(function(){
          $rootScope.showCupoMenu = false;
      });

    $scope.delete_credit = function(){
        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    $scope.current_credit.data.hidden = true;
                    api.credits($scope.current_credit._id).put($scope.current_credit).success(function(res){
                      if(res){
                          sweetAlert.close();
                          $scope.records.length = 0;
                          delete $scope.current_credit;
                          delete $scope.signed;
                          delete $rootScope.signed;

                          $scope.load();
                          
                          $scope.deleted = true;

                          if($scope.isNew){
                              $scope.isNew = false;
                          }

                          $scope.$apply();
                      } 
                    });
               }
           });
    }

    $scope.update_cupon = function(){
      if($rootScope.user.data.cupon_updated){
        swal({
          title: "Ya has actualizado tu cupo",
          text: "por favor solicita un nuevo préstamo",
          type: "warning",
          confirmButtonColor: "#008086",
          closeOnConfirm: false
        },
        function(){
          $state.go("dashboard.new_credit");
          sweetAlert.close();
        });
      }else{
        swal({
          title: "Ampliar cupo de préstamo",
          text: "¿confirma que desea enviar una solictud de aumento de cupo ?",
          type: "info",
          confirmButtonColor: "#008086",
          cancelButtonText: "Cancelar",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function(){
          $rootScope.user.data.cupon = (parseInt($rootScope.user.data.cupon) + 20000);
          $rootScope.user.data.cupon_updated = true;

            api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                if(res){
                    storage.update("user", $rootScope.user);
                    sweetAlert.close();

                    if($rootScope.showBanned ){
                        $state.go("dashboard.home", { reload : true});
                    }else{
                        $state.go("dashboard.new_credit", { reload : true} );
                    }
                    
                    $scope.load();
                }
            });
        });
      }
    }

    $scope.resend = function(){
        var data = {};
        data._user = $rootScope.user._id;
        data._credit = $scope.current_credit._id;

        api.contracts().post(data).success(function(res){
            if(res){
                swal("Firma enviada!", "Hemos enviado una firma electrónica a tu correo, usa el código de 6 caracteres para firmar tu contrato de préstamo", "success");
            }
        });
    }

    $scope.verify = function(){
        if(!$scope.signature){
          swal("Error!", "Por favor escribe la firma electrónica", "warning");
          return;
        }

          api.contracts().add("verify/" + $scope.signature).get().success(function(res){
            if(res){
                  if(res.length == 0 ){
                    swal("Error!", "La firma proporcionada es incorrecta", "warning")
                  }else{
                        $scope.current_credit._contract = res._id;
                        $scope.current_credit.data.status = 'Firmado';

                        api.credits($scope.current_credit._id).put($scope.current_credit).success(function(response){
                            if(response){
                                swal("Contrato Firmado!", "Usted ha firmado correctamente. Su solicitud de crédito sera revisada lo mas pronto posible, de ser aprobado el crédito, se realizara el desombolso en 12 horas hábiles, de ser rechazado su crédito los contratos se anulan y puede volver a solicitar un crédito nuevamente  en 60 días", "success")
                                $scope.isNew = true;
                                $rootScope.hide_note = true;
                                $rootScope.signed = true;

                                delete $rootScope.bank_selected;
                                delete $rootScope.bank_obj;
                                
                                $scope.load();
                                window.scrollTo(0, 0);
                            }
                        });
                  }
            }
          });
    }

    $scope.confirm = function(){
        var data = {};
        data._user = $rootScope.user._id;
        data._credit = $scope.current_credit._id;

        api.contracts().post(data).success(function(res){
            if(res){
                  swal({
                    title: "Firmar Contrato",
                    text: "Revisa tu correo bandeja de entrada o correo no deseado y usa el codigo de 6 caracteres que te hemos enviado. alternativamente hemos enviado un SMS a tu celular con tu firma electrónica",
                    type: "input",
                    confirmButtonColor: "#008086", 
                    confirmButtonText: "Firmar",
                    cancelButtonText: "Cancelar",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Escribe el codigo de 6 caracteres"
                  },
                  function(inputValue){
                    if (inputValue === false) return false;
                    
                    if (inputValue === "") {
                      swal.showInputError("Tu firma es incorrecta!");
                      return false
                    }

                    api.contracts().add("verify/" + inputValue).get().success(function(res){
                      if(res){
                            if(res.length == 0 ){
                              swal.showInputError("Tu firma es incorrecta!");
                            }else{
                                  $scope.current_credit._contract = res._id;
                                  $scope.current_credit.data.status = 'Firmado';

                                  api.credits($scope.current_credit._id).put($scope.current_credit).success(function(response){
                                      if(response){
                                          swal("Contrato Firmado!", "Usted ha firmado correctamente. Su solicitud de crédito sera revisada lo mas pronto posible, de ser aprobado el crédito, se realizara el desombolso en 12 horas hábiles, de ser rechazado su crédito los contratos se anulan y puede volver a solicitar un crédito nuevamente  en 60 días", "success")
                                          $scope.isNew = true;
                                          $rootScope.hide_note = true;
                                          $rootScope.signed = true;

                                          delete $rootScope.bank_selected;
                                          delete $rootScope.bank_obj;
                                          
                                          $scope.load();
                                          window.scrollTo(0, 0);
                                      }
                                  });
                            }
                      }
                    });

                  });  
            }
        });


    }

     $scope.inc_amount_md = function($event){
          if($rootScope.user.data.cupon == 100000){
            return;
          }
            var _current_amount = $scope.amount_instance_md.get();
            var steps = $scope.amount_instance_md.options.step;
            var value = (parseInt(_current_amount) + steps);

            $scope.amount_instance_md.set(value);

      }

      $scope.dec_amount_md = function($event){
          if($rootScope.user.data.cupon == 100000){
            return;
          }

          var _current_amount = $scope.amount_instance_md.get();
          var steps = $scope.amount_instance_md.options.step;
          var value = (parseInt(_current_amount) - steps);

          $scope.amount_instance_md.set(value);
      }

      $scope.inc_days_md = function(){
          var _current_day = $scope.days_instance_md.get();
          var steps = $scope.days_instance_md.options.step;
          var value = (parseInt(_current_day) + steps);

          $scope.days_instance_md.set(value); 

      }

      $scope.dec_days_md = function(){
          var _current_day = $scope.days_instance_md.get();
          var steps = $scope.days_instance_md.options.step;
          var value = (parseInt(_current_day) - steps);

          $scope.days_instance_md.set(value); 
      }

      $scope.inc_amount_mv = function($event){
          if($rootScope.user.data.cupon == 100000){
            return;
          }
            var _current_amount = $scope.amount_instance_mv.get();
            var steps = $scope.amount_instance_mv.options.step;
            var value = (parseInt(_current_amount) + steps);

            $scope.amount_instance_mv.set(value);        
      }

      $scope.dec_amount_mv = function($event){
          if($rootScope.user.data.cupon == 100000){
            return;
          }

          var _current_amount = $scope.amount_instance_mv.get();
          var steps = $scope.amount_instance_mv.options.step;
          var value = (parseInt(_current_amount) - steps);

          $scope.amount_instance_mv.set(value);      
      }

      $scope.inc_days_mv = function(){
          var _current_day = $scope.days_instance_mv.get();
          var steps = $scope.days_instance_mv.options.step;
          var value = (parseInt(_current_day) + steps);

          $scope.days_instance_mv.set(value);  
      }

      $scope.dec_days_mv = function(){
          var _current_day = $scope.days_instance_mv.get();
          var steps = $scope.days_instance_mv.options.step;
          var value = (parseInt(_current_day) - steps);

          $scope.days_instance_mv.set(value);  
      }


    $scope.$watch('new_payment_form.transaction', function(o, n){
      if(n){
        swal({
          title: "Tipo de pago",
          text: "Confirmo que he realizado un :",
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Pago Total",
          cancelButtonColor: "#00999F", 
          confirmButtonColor: "#00999F", 
          cancelButtonText: "Abono",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) {
            $scope.new_payment(true);
          } else {
            $scope.new_payment(false);
          }
        });
      }

      if(o){
        swal({
          title: "Tipo de pago",
          text: "Confirmo que he realizado un :",
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Pago Total",
          cancelButtonColor: "#00999F", 
          confirmButtonColor: "#00999F", 
          cancelButtonText: "Abono",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) {
            $scope.new_payment(true);
            window.sweetAlert.close()
          } else {
            $scope.new_payment(false);
            window.sweetAlert.close()
          }
        });
      }
    });

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

    $scope.detail = function(){
      $state.go('detail', { credit : this.record._id } );
    }

    $scope.show_banks = function(){
      window.modal = modal.show({templateUrl : 'views/dashboard/payment.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
          $rootScope.bank_selected = true;
          
          if($rootScope.signed){
            delete $rootScope.signed;
          }

          $rootScope.hide_note = true;
          $scope.$close();
      }); 
    }

    $scope.show_details = function(){
        $scope.show_detail = $scope.show_detail ? false : true;
    }

    $scope.new_payment = function(type){

      $scope.new_payment_form.data = $scope.paymentForm;
      $scope.new_payment_form.data.bank = $rootScope.bank_obj;
      $scope.new_payment_form._credit = $scope.current_credit._id;
      $scope.new_payment_form._user = $rootScope.user._id;
    
      if(type){
          $scope.new_payment_form.data.tipo_pago = "Total";
        }else{
          $scope.new_payment_form.data.tipo_pago = "Abono";
      }

      api.payments().post($scope.toFormData($scope.new_payment_form), {
        transformRequest: angular.identity,
        headers: {'Content-Type':undefined, enctype:'multipart/form-data'}
        }).success(function(res){
              
              if(res){
                if(type){
                      $scope.current_credit._payment = $scope.current_credit._payment || [];
                      $scope.current_credit._payment.push(res._id);
                      $scope.current_credit._contract = $scope.current_credit._contract ? $scope.current_credit._contract._id : null;
                      $scope.current_credit.data.status = 'Pagado';
                      api.credits($scope.current_credit._id).put($scope.current_credit).success(function(response){
                        if(response){
                          swal("Pago Enviado!", "Has enviado la evidencia de pago correctamente. Este pago esta sujeto a verificación.", "success");
                          delete $rootScope.bank_selected;
                          delete $rootScope.bank_obj;
                          $scope.load();

                        }
                    });                  
                }else{
                  $scope.current_credit._payment = $scope.current_credit._payment || [];
                      $scope.current_credit._payment.push(res._id);
                      $scope.current_credit._contract = $scope.current_credit._contract ? $scope.current_credit._contract._id : null;
                      $scope.current_credit.data.status = 'Pagado';
                      
                      api.credits($scope.current_credit._id).put($scope.current_credit).success(function(response){
                        if(response){
                          swal("Pago Enviado!", "Has enviado la evidencia de pago correctamente. Este pago esta sujeto a verificación.", "success");
                          delete $rootScope.bank_selected;
                          delete $rootScope.bank_obj;
                          $scope.load();

                        }
                    }); 
                }
              }
        });
    }

    $scope.add_to_task = function(){
      if(this.record.add){
        $scope.items_tasks.push(this.record._id);
      }else{
        $scope.items_tasks.splice($scope.items_tasks.indexOf(this.record._id), 1);
      }
    }

    $scope.new_credit = function(){

      $scope.form._user = storage.get('uid') || $rootScope.user._id;
      $scope.form.data.client_metadata = $rootScope.client_metadata || {};
      $scope.form.data.status = 'Pendiente';
      $scope.form.owner = storage.get('uid') || $rootScope.user._id;

      api.credits().post($scope.form).success(function(res){
        if(res){
          if(res.time_to_left < 59){

          }else{
              api.credits().add("current").get().success(function(res){
                  if(res){
                      api.credits().add("email_request/" + res._id).get().success(function(res){
                        if(res){
                              modal.confirm({
                                       confirmButtonText: "Aceptar",
                                       closeOnConfirm : true,
                                       title: "Resumen Enviado.",
                                       showCancelButton: false,
                                       text: "Enviamos un correo con el resumen del crédito, por favor léalo cuidadosamente antes de realizar la firma electrónica, el correo puede llegar en su bandeja de entrada o correo no deseado.",
                                       confirmButtonColor: "#008086",
                                       type: "success" },
                                       function(isConfirm){ 
                                          if (isConfirm) {
                                              $scope.isNew = true;
                                              $scope.isDone = true;
                                              $state.go('dashboard', { without_offer : true });
                                              $scope.load();
                                          }
                                });
                        }
                      });                                                   
                  }
              })
          }
        } 
      }).error(function(data, status){
        if(status == 400){
              modal.confirm({
                       confirmButtonText: "Aceptar",
                       closeOnConfirm : true,
                       title: "Credito Pendiente",
                       showCancelButton: false,
                       text: "Usted ya tiene un préstamo activo.",
                       confirmButtonColor: "#008086",
                       type: "warning" },
                       function(isConfirm){ 
                          if (isConfirm) {
                              $state.go('dashboard');
                          }
              });
        }
      });
    }

    $scope.upload_consignacion_bancaria = function(){
        $scope.paymentForm.payment_type = 'Consignación';
        $('#consignacion_bancaria').click();
    }


    $scope.upload_transacion_bancaria = function(){
          $scope.paymentForm.payment_type = 'Transferencia';
          $('#transaccion_bancaria').click();
    }

    $scope.early_payment = function(){
      $scope.paymentForm = {};

      console.log("deposited_time", $scope.current_credit.data.deposited_time)
      console.log("payday", $scope.current_credit.data.pay_day)

      var system = moment($scope.current_credit.data.deposited_time_server);

      if($scope.freeze_values){
          var now = moment($scope.expiredate);
      }else{
          var now = moment($scope.current_credit.data.locked_time || $scope.current_credit.data.server_time);
      }

      $scope.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');
      $scope.paymentForm.interests = (parseInt($scope.current_credit.data.amount[0]) * (2.18831289 / 100));
      $scope.paymentForm.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays);
      $scope.paymentForm.iva = $scope.paymentForm.system_quote * (19 / 100);
      
      $scope.paymentForm.interestsPeerDays = ( angular.copy($scope.paymentForm.interests) / 30 );
      $scope.paymentForm.interestsDays = ($scope.paymentForm.interestsPeerDays ) * $scope.payForDays;
      
      $scope.totalizePayment();        

    }

    $scope.totalizePayment = function(){
      $scope.paymentForm.total_payment = (parseInt($scope.current_credit.data.amount[0])) + ($scope.paymentForm.interestsDays) + ($scope.paymentForm.system_quote || 0) + ($scope.paymentForm.iva || 0);
    }

    $scope.totalizePayment_30_day = function(){
      $scope.paymentForm_30_day.total_payment = (parseInt($scope.current_credit.data.amount[0])) + ($scope.paymentForm_30_day.interestsDays) + ($scope.paymentForm_30_day.system_quote || 0) + ($scope.paymentForm_30_day.iva || 0);
    }

    $scope.early_payment_30_days = function(){
      $scope.paymentForm_30_day = {};

      $scope.payForDays_30  = 30
      $scope.paymentForm_30_day.interests = (parseInt($scope.current_credit.data.amount[0]) * (2.18831289 / 100));
      $scope.paymentForm_30_day.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays_30);
      $scope.paymentForm_30_day.iva = $scope.paymentForm_30_day.system_quote * (19 / 100);
      
      $scope.paymentForm_30_day.interestsPeerDays = ( angular.copy($scope.paymentForm_30_day.interests) / 30 );
      $scope.paymentForm_30_day.interestsDays = ($scope.paymentForm_30_day.interestsPeerDays ) * $scope.payForDays_30;
      
      $scope.totalizePayment_30_day();   
    }

    $scope.logout = function(){
      window.localStorage.clear();
      
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('home');
    }


    $scope.pay_day = function (days){
      var today = new Date();

      return  new Date(today.getTime() + (days * 24 * 3600 * 1000));
    }

    $scope.totalize = function(){
      $scope.form.data.total_payment = ($scope.form.data.amount[0]) + ($scope.form.data.interestsDays || $scope.form.data.interests) + ($scope.form.data.system_quote || $scope.form.data.system_quote || 0) + ($scope.form.data.ivaDays || $scope.form.data.iva || 0) + ( $scope.form.data.finance_quote || 0);
    }

    $scope.$watch('form.data.days', function(o, n){
        if(n){
            $scope.form.data.pay_day = $scope.pay_day(n[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * n[0];
            $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * n[0]);
            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays || $scope.form.data.system_quote ) * (19 / 100);
            
            $scope.totalize();      

        }

        if(o){
            $scope.form.data.pay_day = $scope.pay_day(o[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = $scope.form.data.interestsPeerDays * o[0];

            $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * o[0]);
            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays || $scope.form.data.system_quote ) * (19 / 100);
            
            $scope.totalize();      
        }
    });

    $scope.$watch('form.data.amount', function(o, n){
        var message;

        if(n){

              /*if(n[0] >= ($rootScope.user.data.cupon || 300000) && !$scope.show_warning_msg){
                    $scope.show_warning_msg = true;
              }else {
                    $scope.show_warning_msg = false;
              }*/
               

              $scope.form.data.interests = (n[0] * (2.18831289 / 100));
              $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.form.data.days[0]);
              $scope.form.data.iva = (($scope.form.data.system_quote + $scope.form.data.finance_quote) * (19 / 100));
              
              $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
              $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * $scope.form.data.days[0];

              $scope.form.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
              $scope.form.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * ($scope.form.data.days[0]);

              $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
              $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays ||  $scope.form.data.system_quote  ) * (19 / 100);
              $scope.totalize();      
        }

        if(o){

              /*if(o[0] >= ($rootScope.user.data.cupon || 300000) && !$scope.show_warning_msg){
                    $scope.show_warning_msg = true;
              }else{
                    $scope.show_warning_msg = false;
              }*/

              $scope.form.data.interests = (o[0] * (2.18831289 / 100));
              $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.form.data.days[0]);

              $scope.form.data.iva = (($scope.form.data.system_quote + $scope.form.data.finance_quote) * (19 / 100));
              
              $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
              $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * $scope.form.data.days[0];

              $scope.form.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
              $scope.form.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * ($scope.form.data.days[0]);

              $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
              $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays ||  $scope.form.data.system_quote  ) * (19 / 100);
              $scope.totalize();       
        }
    });
  
  });
