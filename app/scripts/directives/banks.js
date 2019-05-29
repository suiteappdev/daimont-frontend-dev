'use strict';

angular.module('shoplyApp')
  .directive('banksField', function () {
  	function ctrl($scope, api, modal, $rootScope){

        if($scope.showAll){
            $scope.records = [
              {name : 'Bancolombia', img : 'images/bancolombia.png', account:'08280125459', nit:'901091741', owner:'DAIMONT S.A.S.', type:'Ahorros' },
              {name : 'Davivienda', img : 'images/davivienda.png', account:'206000722424', owner:'LINA CONCEPCION PENATES CHIMA', cc:'1100690755', type:'Ahorros'},
              {name : 'Banco BBVA', img : 'images/bbva.png', account:'488011560', nit:'9010917417', owner:'DAIMONT SAS', type:'Corriente' },
              {name : 'Banco de Bogotá', img : 'images/bogota.png', account:'592622575', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' },
              {name : 'Banco de Occidente', img : 'images/occidente.png' },
              {name : 'Banco AV Villas', img : 'images/avvillas.png'},
              {name : 'Banco Popular', img : 'images/popular.png'},
              {name : 'Banco Colpatria', img : 'images/colpatria.png', account:'9362004758', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' }
            ]          
          }else{
            $scope.records = [
              {name : 'Bancolombia', img : 'images/bancolombia.png', account:'08280125459', nit:'901091741', owner:'DAIMONT S.A.S.', type:'Ahorros' },
              {name : 'Davivienda', img : 'images/davivienda.png', account:'206000722424', owner:'LINA CONCEPCION PENATES CHIMA', cc:'1100690755', type:'Ahorros'},
              {name : 'Banco BBVA', img : 'images/bbva.png', account:'488011560', nit:'9010917417', owner:'DAIMONT SAS', type:'Corriente' },
              {name : 'Grupo AVAL', img : 'images/aval.png', account:'592622575', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' },
              {name : 'Banco Colpatria', img : 'images/colpatria.png', account:'9362004758', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' }
            ]        
          } 
               
        $scope.myConfig = {
          plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
          noResultText :'aun no tenemos registrado este banco.',
          create:false,
          valueField: $scope.key,
          labelField: $scope.label,
          placeholder: $scope.placeholder || 'Bancos',
          maxItems: 1,
          searchField : $scope.searchby || 'name',
          maxOptions : 8,
          openOnFocus : true,
          selectOnTab : true,
          setFocus : $scope.setFocus || false,
          render: {
                option: function(item, escape) {
                    if(item.img){
                      return '<div><img class="bank-dropdown-items" src="'+item.img+'" />' +
                           '<span class="bank-dropdown-value">'+escape(item.name)+'</span></div>'
                    }
              }
          },

          onItemAdd : function(value, $item){
            $scope.records.forEach(function(v, k){
              if(v[$scope.key] == value){
                    var _bank = angular.copy(v);
                    delete  _bank.$order;

                    $scope.setObject = _bank;
                    return;
              }
            });
          }
        };

  	 };
      
    return {
      template: '<selectize ng-disabled="disabled" config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
        ngModel : "=",
        setObject:"=",
        setFocus : "=",
        showAll : "@",
        key : "@",
        disabled :"=",
        label : "@",
        searchby:"=",
        placeholder:"@"
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {
      
      }
    };
  });