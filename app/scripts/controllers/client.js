'use strict';

angular.module('shoplyApp').controller('ClientCtrl', function ($scope, $rootScope, sweetAlert, constants, $state, modal, api, storage, $stateParams, $http, $filter, $timeout) {
  	$scope.items_tasks = [];
    $scope.Records  = false;
    $scope.records = [];
    $scope.params = $stateParams;
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;

    $scope.currentPage = 1;
    $scope.items = 20;

    $scope.itemsConfig = {
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Mostrar'
    }

    $scope.load = function(){
      api.clients().get().success(function(res){
          $scope.records = res || []
          $scope.Records  = true;
      });
  	}

    $scope.go_detail = function(){
      window.location.href="#!/detail/" + this.recordcredit._id
    }

    $scope.earlyPaymentRow = function(){

      this.paymentForm = {};
      console.log("record", this.recordcredit);
      
      if(this.recordcredit && this.recordcredit.data){
          var system = moment(this.record.data.deposited_time);
          var now = moment(new Date().toISOString());

          this.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');

          this.paymentForm.interests = (parseInt(this.recordcredit.data.amount[0]) * (2.18831289/ 100));

          this.paymentForm.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * this.payForDays);
          this.paymentForm.iva = this.paymentForm.system_quote * (19 / 100);
        
          this.paymentForm.interestsPeerDays = ( angular.copy(this.paymentForm.interests) / 30 );
          this.paymentForm.interestsDays = (this.paymentForm.interestsPeerDays ) * this.payForDays;
        
          this.paymentForm.total_payment = (parseInt(this.recordcredit.data.amount[0])) + (this.paymentForm.interestsDays) + (this.paymentForm.system_quote || 0) + (this.paymentForm.iva || 0); 
      }
      
    } 

    $scope.contract = function(){
        console.log("this contract", this)
        var _self = this.recordcredit;

        $http.get('views/utils/contract.ejs').success(function(res){
          var _template = ejs.render(res, { _data : { 
                nombre : _self._user.name + ' ' +_self._user.last_name,
                email : _self._user.email,
                telefono : _self._user.data.phone || 'sin telefono',
                cedula : _self._user.cc,
                ciudad : _self._user.data.ciudad,
                direccion : _self._user.data.direccion,
                dias : _self.data.days[0],
                fecha_vencimiento : moment(new Date(_self.data.pay_day)).format('MMMM DD, YYYY'),
                fecha_actual :  moment(new Date("2019-02-10 16:23:34.632Z")).format('MMMM DD YYYY, h:mm:ss a'),
                interes :$filter('currency')(_self.data.interestsDays),
                monto : $filter('currency')(_self.data.amount[0]),
                total : $filter('currency')(_self.data.total_payment),
                cupon : $filter('currency')(_self._user.data.cupon),
               // ip:_self.data.client_metadata.ip || 'no definida',
                codigo: (_self.data && _self.data.auto_signed) ? 'Auto firma' : _self._contract.data.contract,
                consecutivo:_self.data.id
          }});

          console.log(_template)

          var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
          
          w.document.write(_template);
          w.print();
      });
    }

    $scope.credits = function(){
      $scope.user_credit = this.record;

      window.modal = modal.show({templateUrl : 'views/clients/credits.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
            $scope.$close();
      }); 
    }

    $scope.payments = function(){
      $scope.user_credit = this.record;

      window.modal = modal.show({templateUrl : 'views/clients/payments.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
            $scope.$close();
      }); 
    }

    $scope.getUserCredits = function(){
     api.clients().add("credit/" + $scope.user_credit._id).get().success(function(res){
          $scope.credits_records = res.map(function(cre){
              if(cre.data.status == 'Consignado'){
                var fecha_consignacion = moment(cre.data.deposited_time_server); 
                var hoy = moment();
                var dias = hoy.diff(fecha_consignacion, 'days');

                if(dias > 30){
                  cre.data.status = 'Morosos';
                  return cre;
                }else{
                  return cre;
                }
              }else{
                return cre;
              }
          });

          $scope.Records  = true;
      });
    }

    $scope.getPaymentsCredits = function(){
      console.log("GETPAYMENTRECORD",  $scope.user_credit)
      api.payments().add("user/" + $scope.user_credit._id).get().success(function(res){
          $scope.payments_records = res || []
          $scope.Records  = true;
      });
    }

    $scope.delete = function(){
      var record = this.record;

        modal.removeConfirm({closeOnConfirm : true}, 
            function(isConfirm){ 
               if (isConfirm) {
                    api.clients(record._id).delete().success(function(res){
                      if(res){
                          swal({
                              title: "Registro Eliminado",
                              text: "Has eliminado este registro satifactoriamente",
                              type: "success",
                              confirmButtonColor: "#008086",
                              closeOnConfirm: false
                            },
                            function(){
                              $state.go("clients");
                              $scope.records.splice($scope.records.indexOf(record), 1);
                              window.sweetAlert.close();
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

      $state.go('/home');
    }

});
