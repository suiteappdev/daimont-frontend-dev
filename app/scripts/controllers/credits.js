'use strict';

/**
 * @ngdoc function
 * @name shoplyApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the shoplyApp
 */
angular.module('shoplyApp')
  .controller('CreditsCtrl', function ($scope, modal, $stateParams,  api, storage, $state, $rootScope, $timeout, $http, $firebaseObject, $firebaseArray) {
    $scope.items_tasks = [];
    $scope.Records  = false;
    $scope.records = [];
    $scope.params = $stateParams;
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;
    $scope.items = 20;

    api.credits().add('firmado').get().success(function(res){
          $rootScope.result_length = res.length;
    });  

    api.credits().add('aceptado').get().success(function(res){
          $rootScope.result_length_aprobado = res.length;
    }); 

    api.credits().add('preaprobado').get().success(function(res){
          $rootScope.result_length_preaprobado = res.length;
    }); 

    api.credits().add('preventivo').get().success(function(res){
          $rootScope.result_length_preventivo = res.filter(function(c){
              return !c.data.viewedPreventivo;
          }).length;
    }); 

    api.credits().add('pendiente_48').get().success(function(res){
          $rootScope.result_length_pendiente_48 = res.length;
    }); 

    $rootScope.$on("NEW_CREDIT_PUSH", function(evt, data){
      console.log("data $rootScope", data);

      if($stateParams.status == 'firmado'){
           $scope.records.push(data); 
           $scope.$apply();     
      }
    });

    $scope.itemsConfig = {
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Mostrar'
    }

    
    $scope.load = function(){

      if( $state.current.name == 'preventivos'){
          api.credits().add('preventivo').get().success(function(res){
                $scope.records = res || []
                $scope.Records  = true;
          }); 

          return;
      }

      if($stateParams.status){
          if($stateParams.status == 'firmado'){
              api.credits().add('firmado').get().success(function(res){
                    $scope.records = res || []
                    $rootScope.result_length = $scope.records.length;
                    $scope.Records  = true;
              });            
            }else if($stateParams.status == 'pendiente'){
                api.credits().add('pendiente').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'consignado'){
                api.credits().add('consignado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'pagado'){
                api.credits().add('pagado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'pendiente_48'){
                api.credits().add('pendiente_48').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'preventivo'){
                api.credits().add('preventivo').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'rechazado'){
                api.credits().add('rechazado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }) 
            }else if($stateParams.status == 'morosos'){
                api.credits().add('morosos').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }) 
            }else if($stateParams.status == 'actualizado'){
                api.credits().add('actualizado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'desactualizado'){
                api.credits().add('desactualizado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                }); 
            }else if($stateParams.status == 'todos'){
                api.credits().add('all').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                });
            }else if($stateParams.status == 'aceptado'){
                api.credits().add('aceptado').get().success(function(res){
                      $scope.records = res || []
                      $rootScope.result_length_aprobado = $scope.records.length;
                      $scope.Records  = true;
                });   
            }else if($stateParams.status == 'anulado'){
                api.credits().add('anulado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                });   
            }else if($stateParams.status == 'consultado'){
                api.credits().add('consultado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                });   
            }else if($stateParams.status == 'preaprobado'){
                api.credits().add('preaprobado').get().success(function(res){
                      $scope.records = res || []
                      $rootScope.result_length_preaprobado = $scope.records.length;
                      $scope.Records  = true;
                });   
            }else if($stateParams.status == 'fraude'){
                api.credits().add('fraude').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                });   
            }else if($stateParams.status == 'dificil_recaudo'){
                api.credits().add('dificil_recaudo').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                });   
            }else if($stateParams.status == 'finalizado'){
                api.credits().add('finalizado').get().success(function(res){
                      $scope.records = res || []
                      $scope.Records  = true;
                });
            } 
      }else{
        api.credits().add('all').get().success(function(res){
              $scope.records = res || []
              $scope.Records  = true;
        });
      }

      api.payments().add("all").get().success(function(res){
        $rootScope.payments_records = res || [];
      });
    }

    $scope.$watch('monto', function(n, o){
      if(n){
              $scope.credit.data.amount[0] = $scope.monto;
              $scope.credit.data.interests = ($scope.monto * (2.18831289 / 100));
              $scope.credit.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.credit.data.days[0]);
              $scope.credit.data.interestsPeerDays = ( angular.copy($scope.credit.data.interests) / 30 );
              $scope.credit.data.interestsDays = ($scope.credit.data.interestsPeerDays) * $scope.credit.data.days[0];
              $scope.credit.data.iva = $scope.credit.data.system_quote  * (19 / 100);

              $scope.credit.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
              $scope.credit.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * ($scope.credit.data.days[0]);

              $scope.form.data.ivaPeerdays = (angular.copy($scope.credit.data.iva) / 30);
              $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.credit.data.system_quoteDays || $scope.credit.data.system_quote ) * (19 / 100);
              
              $scope.credit.data.total_payment = ($scope.monto) + ($scope.credit.data.interestsDays || $scope.credit.data.interests) + ($scope.credit.data.system_quote || $scope.credit.data.system_quote || 0) + ($scope.credit.data.ivaDays || $scope.credit.data.iva || 0) + ( $scope.form.data.finance_quote || 0);
      }

      if(o){
              $scope.credit.data.amount[0] = $scope.monto;
              $scope.credit.data.interests = ($scope.monto * (2.18831289 / 100));
              $scope.credit.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.credit.data.days[0]);
              $scope.credit.data.interestsPeerDays = ( angular.copy($scope.credit.data.interests) / 30 );
              $scope.credit.data.interestsDays = ($scope.credit.data.interestsPeerDays) * $scope.credit.data.days[0];
              $scope.credit.data.iva = $scope.credit.data.system_quote  * (19 / 100);

              $scope.credit.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
              $scope.credit.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * ($scope.credit.data.days[0]);

              $scope.form.data.ivaPeerdays = (angular.copy($scope.credit.data.iva) / 30);
              $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.credit.data.system_quoteDays || $scope.credit.data.system_quote ) * (19 / 100);
              
              $scope.credit.data.total_payment = ($scope.monto) + ($scope.credit.data.interestsDays || $scope.credit.data.interests) + ($scope.credit.data.system_quote || $scope.credit.data.system_quote || 0) + ($scope.credit.data.ivaDays || $scope.credit.data.iva || 0) + ( $scope.form.data.finance_quote || 0);
      }
    });

    $scope.changeAmount = function(){
      $scope.credit = this.record;
      $scope.monto = $scope.credit.data.amount[0];

      window.modal = modal.show({templateUrl : 'views/credits/changeAmount.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
       
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Desea cambiar el monto de este crédito?",
               confirmButtonColor: "#008086",
               type: "warning" },
               function(isConfirm){ 
                   if (isConfirm) {
                
                    if( $scope.credit.data.cf){
                        delete $scope.credit.data.cf.$id;
                        delete $scope.credit.data.cf.$priority;
                    }

                    if( $scope.credit.data.cl){
                        delete $scope.credit.data.cl.$id;
                        delete $scope.credit.data.cl.$priority; 
                    }
                    if( $scope.credit.data.ca){
                         delete $scope.credit.data.ca.$id;
                        delete $scope.credit.data.ca.$priority; 
                    }

                    if( $scope.credit.data.dt){
                        delete $scope.credit.data.dt.$id;
                        delete $scope.credit.data.dt.$priority; 
                    }

                    if( $scope.credit.data.dt2){
                        delete $scope.credit.data.dt2.$id;
                        delete $scope.credit.data.dt2.$priority; 
                    }

                    if( $scope.credit.data.ce){
                        delete $scope.credit.data.ce.$id;
                        delete $scope.credit.data.ce.$priority; 
                    }

                    if( $scope.credit.data.ex){
                        delete $scope.credit.data.ex.$id;
                        delete $scope.credit.data.ex.$priority; 
                    }

                    if( $scope.credit.data.ex2){
                        delete $scope.credit.data.ex2.$id;
                        delete $scope.credit.data.ex2.$priority;  
                    }

                    if( $scope.credit.data.re){
                        delete $scope.credit.data.re.$id;
                        delete $scope.credit.data.re.$priority;  
                    }
                      api.credits($scope.credit._id).put($scope.credit).success(function(res){
                        if(res){
                            swal({
                              title: "Bien Hecho",
                              text: "Monto cambiado correctamente.",
                              type: "success",
                              showCancelButton: false,
                              confirmButtonColor: "#008086",
                              confirmButtonText: "Ok",
                              closeOnConfirm: true
                            },
                            function(){
                               $scope.$close();
                            });
                        }
                      }); 
                   }
        });
      }); 
    }


    $scope.preventive = function(){
      this.record.data._preventive = this.record.data._preventive ? false : true;
      var _record = this.record;

      if(_record.data._preventive){
           modal.confirm({
                   closeOnConfirm : true,
                   title: "Está Seguro?",
                   text: "confirmas que deseas enviar la notificación de prevención de pago ?",
                   confirmButtonColor: "#008086",
                   type: "success" },
                   function(isConfirm){ 
                       if (isConfirm) {
                            api.credits().add("notify-preventive/" + _record._id + "/enable").put().success(function(res){
                              console.log("notify-preventive", true);
                            });

                       }
            });   
      }else{
          api.credits().add("notify-preventive/" + _record._id + "/disabled").put().success(function(res){
            console.log("notify-preventive", false);
          });
      }
    }

    $scope.second_preventive = function(){
      this.record.data._second_preventive = this.record.data._second_preventive ? false : true;
      var _record = this.record;

      if(_record.data._second_preventive){
           modal.confirm({
                   closeOnConfirm : true,
                   title: "Está Seguro?",
                   text: "confirmas que deseas enviar la notificación de prevención de pago ?",
                   confirmButtonColor: "#008086",
                   type: "success" },
                   function(isConfirm){ 
                       if (isConfirm) {
                            api.credits().add("second-notify-preventive/" + _record._id + "/enable").put().success(function(res){
                              console.log("notify-preventive", true);
                            });

                       }
            });   
      }else{
          api.credits().add("second-notify-preventive/" + _record._id + "/disabled").put().success(function(res){
            console.log("notify-preventive", false);
          });
      }
    }

    $scope._request_onWhatsApps = function(){
      this.record.data._request_onWhatsApps = this.record.data._request_onWhatsApps ? false : true;
      if(this.record.data._request_onWhatsApps){
          api.credits().add("request/whatsapp/" + this.record._id + "/enable").put().success(function(res){
            console.log("whatapp", true);
          });
      }else{
          api.credits().add("request/whatsapp/" + this.record._id + "/disabled").put().success(function(res){
            console.log("whatapp", false);
          });
      }
    }

    $scope._request_onPhone = function(){
      this.record.data._request_onPhone = this.record.data._request_onPhone ? false : true;

      if(this.record.data._request_onPhone){
          api.credits().add("request/phone/" + this.record._id + "/enable").put().success(function(res){

          });
      }else{
          api.credits().add("request/phone/" + this.record._id + "/disabled").put().success(function(res){

          });
      }

    }

    $scope._request_onEmail = function(){
      this.record.data._request_onEmail = this.record.data._request_onEmail ? false : true;
      
      if(this.record.data._request_onEmail){
          api.credits().add("request/email/" + this.record._id + "/enable").put().success(function(res){


          });
      }else{
          api.credits().add("request/email/" + this.record._id + "/disabled").put().success(function(res){
          

          });
      }
    }

    $scope._request_onBankCheck = function(){
      var _record = this.record;

       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "confirmas que deseas realizar este movimiento ?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                        _record._user.data._request_onBankCheck = _record._user.data._request_onBankCheck ? false : true;

                      if(_record._user.data._request_onBankCheck){
                          api.credits().add("request/bankCheck/" + _record._user._id + "/enable").put().success(function(res){
                            console.log("bankCheck", true);
                          });
                      }else{

                          api.credits().add("request/bankCheck/" + _record._user._id + "/disabled").put().success(function(res){
                            console.log("bankCheck", false);
                          });
                      }
                   }
        });
    }

    $scope._request_onPhoneCheck = function(){
      var _record = this.record;
       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "confirmas que deseas realizar este movimiento ?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                      _record._user.data._request_onPhoneCheck = _record._user.data._request_onPhoneCheck ? false : true;
                      if(_record._user.data._request_onPhoneCheck){
                          api.credits().add("request/phoneCheck/" + _record._user._id + "/enable").put().success(function(res){

                          });
                      }else{
                          api.credits().add("request/phoneCheck/" + _record._user._id + "/disabled").put().success(function(res){

                          });
                      }
                   }
        });
    }

    $scope._request_onEmailCheck = function(){
      var _record = this.record;

       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "confirmas que deseas realizar este movimiento ?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                          _record._user.data._request_onEmailCheck = _record._user.data._request_onEmailCheck ? false : true;
                          
                          if(_record._user.data._request_onEmailCheck){
                              api.credits().add("request/emailCheck/" + _record._user._id + "/enable").put().success(function(res){


                              });
                          }else{
                              api.credits().add("request/emailCheck/" + _record._user._id + "/disabled").put().success(function(res){
                              

                              });
                          }
                   }
        });

    }



  $scope._payment_onWhatsApps = function(){
      this.record.data._payment_onWhatsApps = this.record.data._payment_onWhatsApps ? false : true;
      if(this.record.data._payment_onWhatsApps){
          api.credits().add("payment/whatsapp/" + this.record._id + "/enable").put().success(function(res){
            console.log("whatapp", true);
          });
      }else{
          api.credits().add("payment/whatsapp/" + this.record._id + "/disabled").put().success(function(res){
            console.log("whatapp", false);
          });
      }
    }

    $scope._payment_onPhone = function(){
      this.record.data._payment_onPhone = this.record.data._payment_onPhone ? false : true;

      if(this.record.data._payment_onPhone){
          api.credits().add("payment/phone/" + this.record._id + "/enable").put().success(function(res){

          });
      }else{
          api.credits().add("payment/phone/" + this.record._id + "/disabled").put().success(function(res){

          });
      }

    }

    $scope._payment_onEmail = function(){
      this.record.data._payment_onEmail = this.record.data._payment_onEmail ? false : true;
      
      if(this.record.data._payment_onEmail){
          api.credits().add("payment/email/" + this.record._id + "/enable").put().success(function(res){


          });
      }else{
          api.credits().add("payment/email/" + this.record._id + "/disabled").put().success(function(res){
          

          });
      }
    }

    $scope.preEmail = function(){
      var _record = this.record;

       modal.confirm({
               closeOnConfirm : true,
               title: "Está Seguro?",
               text: "Quieres enviar email de preaviso a este cliente?",
               confirmButtonColor: "#008086",
               type: "success" },
               function(isConfirm){ 
                   if (isConfirm) {
                    _record._user.data._payment_onNotice = true;

                        api.credits().add("notice/" + _record._id).post({}).success(function(res){
                            swal({
                                title: "Bien Hecho",
                                text: "Preaviso enviado correctamente.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#008086",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                              });
                        }); 
                   }
        });
    }

    $scope.getComment = function(){
        var refForArray = firebase.database().ref("profileMessages").child(this.record._user._id);
        var syncObject = $firebaseObject(refForArray);
        this.record.comments = $firebaseArray(refForArray); 
        this.record.comment = $firebaseArray(refForArray.limitToLast(1));
    }

    $scope.getFiles = function(){
          var record = this.record;

          var refForArrayFiles =  firebase.database().ref("files").child(this.record._user._id);
          this.files = $firebaseArray(refForArrayFiles);

          this.files.$loaded(function(data){
                if(data.length > 0){
                    record.data.cf = data.filter(function(f){
                      return f.type == 'cf' || f.type == 'cl' || f.type == 'ca';
                    })[0];

                    record.data.dt = data.filter(function(f){
                      return f.type == 'dt'  || f.type == 'dt2';
                    })[0];

                    record.data.ce = data.filter(function(f){
                      return f.type == 'ce';
                    })[0];

                    record.data.ex = data.filter(function(f){
                      return f.type == 'ex';
                    })[0];

                    record.data.ex2 = data.filter(function(f){
                      return f.type == 'ex2';
                    })[0];

                    record.data.re = data.filter(function(f){
                      return f.type == 're';
                    })[0];
                }
          });
    }

    $scope.getCommentCredit = function(){
      var refForArray = firebase.database().ref(this.record._id);

        var syncObject = $firebaseObject(refForArray);
         this.record.commentCreditsCollection = $firebaseArray(refForArray);
        this.record.commentCredits = $firebaseArray(refForArray.limitToLast(1));
    }

    $scope.setCriteriaField = function(){
      if(this.record && this.record._user){
          this.record.creiteria = ((this.record._user.name || '') +' '+ (this.record._user.data.second_name || '') +' '+ (this.record._user.last_name || '') + (this.record._user.data.second_last_name || '')).toString().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/\s\s/g, " ").toLowerCase();
      }
    }

    $scope.update_cupon = function(){
      $scope.user = angular.copy($scope.items_tasks[0]._user);

      window.modal = modal.show({templateUrl : 'views/credits/update_cupon.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
          api.user($scope.user._id).add("/update-cupon").put({cupon : $scope.user.data.cupon}).success(function(response){
              if(response){
                
                swal({
                  title: "Bien Hecho",
                  text: "Cupo actualizado",
                  type: "success",
                  confirmButtonColor: "#008086",
                  closeOnConfirm: true,
                });

                 $scope.$close();
                 $scope.load();
              }
          });
      }); 
    }

    $scope.detail = function(){
      $state.go('detail', { credit : this.record._id } );
    }

    $scope.setNegrita = function(){
      if(this.record.data.viewedPreventivo){
        api.credits().add("unset-viewed-preventivo/" + this.record._id).put({}).success(function(response){
            console.log("response", response);
        });  
      }else{
        api.credits().add("set-viewed-preventivo/" + this.record._id).put({}).success(function(response){
            console.log("response", response);
        }); 
      }
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

    $scope.get_date = function(){
      if($scope.params.status == 'consignado'){
            this.record.date = moment(this.record.data.deposited_time).add(30, "days");
      }else if($scope.params.status == 'pendiente'){
            this.record.date = this.record.data.pay_day;
      }else if($scope.params.status == 'firmado'){
            this.record.date = this.record.data.pay_day;
      }else if($scope.params.status == 'finalizado'){
            this.record.date = this.record._payment.createdAt;
      }else if($scope.params.status == 'todos'){
            this.record.date = this.record.data.pay_day;
      }else if($scope.params.status == 'rechazado'){
            this.record.date = this.record.createdAt;
      }
    }

    $scope.earlyPaymentRow = function(){
      if(this.record && this.record._user){
          this.record.creiteria = (this.record._user.name +' '+ this.record._user.data.second_name + ' ' + this.record._user.last_name +' '+ this.record._user.data.second_last_name).toLowerCase();
      }

      this.paymentForm = {};

      if(this.record && this.record.data){
          var system = moment(this.record.data.deposited_time);
          var now = moment(new Date().toISOString());

          this.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');

          this.paymentForm.interests = (parseInt(this.record.data.amount[0]) * (2.18831289/ 100));

          this.paymentForm.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * this.payForDays);
          this.paymentForm.iva = this.paymentForm.system_quote * (19 / 100);
        
          this.paymentForm.interestsPeerDays = ( angular.copy(this.paymentForm.interests) / 30 );
          this.paymentForm.interestsDays = (this.paymentForm.interestsPeerDays ) * this.payForDays;
        
          this.paymentForm.total_payment = (parseInt(this.record.data.amount[0])) + (this.paymentForm.interestsDays) + (this.paymentForm.system_quote || 0) + (this.paymentForm.iva || 0); 
      }
      
    }

    $scope.early_payment = function(){
      $scope.paymentForm = {};

      console.log("deposited_time", $scope.current_credit.data.deposited_time)
      console.log("payday", $scope.current_credit.data.pay_day)

      var system = moment($scope.current_credit.data.deposited_time);
      var now = moment(new Date().toISOString());

      $scope.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');

      $scope.paymentForm.interests = (parseInt($scope.current_credit.data.amount[0]) * (2.4991666667 / 100));

      $scope.paymentForm.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays);
      $scope.paymentForm.iva = $scope.paymentForm.system_quote * (19 / 100);
      
      $scope.paymentForm.interestsPeerDays = ( angular.copy($scope.paymentForm.interests) / 30 );
      $scope.paymentForm.interestsDays = ($scope.paymentForm.interestsPeerDays ) * $scope.payForDays;
      
      $scope.totalizePayment();        

    }

    $scope.delete_credit = function(){
         var record = this.record;
         var original = this.record;

         modal.confirm({
                 closeOnConfirm : true,
                 title: "Está Seguro?",
                 text: "Confirma que desea eliminar este préstamo?",
                 confirmButtonColor: "#008086",
                 type: "success" },

                 function(isConfirm){ 

                     if (isConfirm) {
                        
                        record.data.hidden = true;

                        api.credits(record._id).put(record).success(function(res){
                          if(res){
                             sweetAlert.close();
                             $scope.records.splice($scope.records.indexOf(original), 1);
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
