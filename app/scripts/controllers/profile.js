'use strict';

angular.module('shoplyApp')
  .controller('profileCtrl', function ($scope, api, modal, constants, $state, storage, account, $rootScope, $stateParams, $timeout, $http, sweetAlert) {
    if($rootScope.user.cc){
        $scope.old_cc = angular.copy(parseInt(JSON.parse(window.localStorage.user).cc));
    }

    if($rootScope.user.data.updated){
        $rootScope.old_user = angular.copy($rootScope.user); 
    }

    $scope.old_email = angular.copy(JSON.parse(window.localStorage.user).email);
    
    $scope.cuentas_bancarias = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false, maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'¿Cuántas cuentas bancarias tiene usted?'
    };

    $scope.sexo = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Sexo' 
    };

    $scope.estado_civil = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Estado Civil' 
    };

    $scope.tarjetas_credito = {
            plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
            create:false,
            maxItems:1,
            valueField: 'value',
            labelField: 'text',
            placeholder:'¿Tiene tarjetas de crédito?'
    };

    $scope.tipo_cuenta = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Tipo de cuenta'
    };

    $scope.nivel_estudio = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Nivel de Estudio'
    }; 

    $scope.role = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Actualmente soy'
    };

    $scope.vivienda = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Tipo de vivienda' 
    };

    $scope.estrato = {
        plugins: SmartPhone.isAny() ? ['hidden_textfield'] : [],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Estrato'
    }

    
    $scope.ingresos_records = [
                        {number:500000,  value:"Menos de 500.000", text:"Menos de 500.000"},
                        {number:500001,  value:"De 500.000 hasta 1.000.000", text:"De 500.000 hasta 1.000.000"},
                        {number:1000001, value:"De 1.000.001 hasta 1.500.000", text:"De 1.000.001 hasta 1.500.000"},
                        {number:1500001, value:"De 1.500.001 hasta 2.000.000", text:"De 1.500.001 hasta 2.000.000"},
                        {number:2000001, value:"De 2.000.001 hasta 2.500.000", text:"De 2.000.001 hasta 2.500.000"},
                        {number:2500001, value:"De 2.500.001 hasta 3.000.000", text:"De 2.500.001 hasta 3.000.000"},
                        {number:3000001, value:"De 3.000.001 hasta 3.500.000", text:"De 3.000.001 hasta 3.500.000"},
                        {number:3500001, value:"De 3.500.001 hasta 4.000.000", text:"De 3.500.001 hasta 4.000.000"},
                        {number:4000001, value:"De 4.000.001 hasta 4.500.000", text:"De 4.000.001 hasta 4.500.000"},
                        {number:4500001, value:"De 4.500.001 hasta 5.000.000", text:"De 4.500.001 hasta 5.000.000"},
                        {number:5000001, value:"De 5.000.001 hasta 5.500.000", text:"De 5.000.001 hasta 5.500.000"},
                        {number:5500001, value:"De 5.500.001 hasta 6.000.000", text:"De 5.500.001 hasta 6.000.000"},
                        {number:7000001, value:"De 6.000.001 en adelante", text:"De 6.000.001 en adelante"}
                    ];

    $scope.egresos_records = [
                        {number:500000,  value:"Menos de 500.000", text:"Menos de 500.000"},
                        {number:500001,  value:"De 500.000 hasta 1.000.000", text:"De 500.000 hasta 1.000.000"},
                        {number:1000001, value:"De 1.000.001 hasta 1.500.000", text:"De 1.000.001 hasta 1.500.000"},
                        {number:1500001, value:"De 1.500.001 hasta 2.000.000", text:"De 1.500.001 hasta 2.000.000"},
                        {number:2000001, value:"De 2.000.001 hasta 2.500.000", text:"De 2.000.001 hasta 2.500.000"},
                        {number:2500001, value:"De 2.500.001 hasta 3.000.000", text:"De 2.500.001 hasta 3.000.000"},
                        {number:3000001, value:"De 3.000.001 hasta 3.500.000", text:"De 3.000.001 hasta 3.500.000"},
                        {number:3500001, value:"De 3.500.001 hasta 4.000.000", text:"De 3.500.001 hasta 4.000.000"},
                        {number:4000001, value:"De 4.000.001 hasta 4.500.000", text:"De 4.000.001 hasta 4.500.000"},
                        {number:4500001, value:"De 4.500.001 hasta 5.000.000", text:"De 4.500.001 hasta 5.000.000"},
                        {number:5000001, value:"De 5.000.001 hasta 5.500.000", text:"De 5.000.001 hasta 5.500.000"},
                        {number:5500001, value:"De 5.500.001 hasta 6.000.000", text:"De 5.500.001 hasta 6.000.000"},
                        {number:7000001, value:"De 6.000.001 en adelante", text:"De 6.000.001 en adelante"}
                           ];

$scope.ocupacion_records = [
    {value:"Administrador (a)"},
    {value:"Administrador en finanzas"},
    {value:"Albañil"},
    {value:"Auditor (a)"},
    {value:"Arquitecto (a) "},
    {value:"Auxiliar de enfermería"},
    {value:"Comunicador social"},
    {value:"Camarero (a)"},
    {value:"Chef"},
    {value:"Contador (a)"},
    {value:"Contralor (a)"},
    {value:"Comerciante"},
    {value:"Deportista profesional"},
    {value:"Diseñador (a) grafico"},
    {value:"Docente"},
    {value:"Economista"},
    {value:"Enfermero (a)"},
    {value:"Estilista"},
    {value:"Estudiante"},
    {value:"Farmacólogo (a)"},
    {value:"Fisioterapeuta"},
    {value:"Fonoaudiólogo (a)"},
    {value:"Gerente (cargos corporativos)"},
    {value:"Ingeniero (a)"},
    {value:"Medico (a)"},
    {value:"Militar (soldado, teniente, etc.)"},
    {value:"Odontólogo"},
    {value:"Policía"},
    {value:"Psicólogo (a)"},
    {value:"Publicista"},
    {value:"Recepcionista"},
    {value:"Secretario (a)"},
    {value:"Servicio al cliente"},
    {value:"Trabajador (a) social"},
    {value:"Técnico (eléctrico, salud ocupacional, sistemas, etc.)"},
    {value:"veterinario"},
    {value:"Vigilante"}
]

    $scope.ocupacion_setup = { 
        create:true, 
        maxItems:1, 
        valueField: 'value', 
        labelField: 'value', 
        searchField : 'value',
        placeholder:'Escribe tu ocupación actual'
    }; 


    $scope.ingresos_setup = { 
        plugins: ['hidden_textfield'],
        create:true, 
        maxItems:1, 
        valueField: 'value', 
        labelField: 'text', 
        placeholder:'Ingresos totales mensuales',
        onItemAdd : function(value, $item){
            $rootScope.user.data.ingresos_obj = angular.copy($scope.ingresos_records.filter(function(obj){
                return obj.value == value;
            })[0]);
        } 
    };

    $scope.egresos_setup = { 
            plugins: ['hidden_textfield'],
            create:true, maxItems:1, 
            valueField: 'value', 
            labelField: 'text', 
            placeholder:'Egresos totales mensuales',
            onItemAdd : function(value, $item){
                $rootScope.user.data.egresos_obj = angular.copy($scope.egresos_records.filter(function(obj){
                    return obj.value == value;
                })[0]);
            } 
    };
    
    $scope.load = function(){
        if(!$rootScope.user){
            $state.go("home");
            return;
        }

        $scope.form = {};
        $scope.form.data = $rootScope.user;

        if($stateParams.credit){
            $scope.credit = $stateParams.credit;
        }

    }

    $scope.parseCC =  function(){
        $rootScope.user.cc = parseInt($rootScope.user.cc);
    }

    $scope.go_bank =  function(){
        if(!$rootScope.user.data.nivel_estudio){
            $scope.finance.nivel_estudio.$setValidity('required', false);

        }else{
          $scope.finance.nivel_estudio.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.perfil_actual){
            $scope.finance.perfil_actual.$setValidity('required', false);

        }else{
          $scope.finance.perfil_actual.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.ingresos_totales){
            $scope.finance.ingresos_totales.$setValidity('required', false);

        }else{
          $scope.finance.ingresos_totales.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.egresos_totales){
            $scope.finance.egresos_totales.$setValidity('required', false);

        }else{
          $scope.finance.egresos_totales.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.ocupacion){
            $scope.finance.ocupacion.$setValidity('required', false);

        }else{
          $scope.finance.ocupacion.$setValidity('required', true);
        } 


        if($scope.finance.$invalid){
            modal.incompleteForm();
            $scope.finance.$setSubmitted();
            return ;
        }   

        $state.go("profile.bank");   
    }

    $scope.go_to_resumen = function(){
        
        if($rootScope.cc_exist){
            sweetAlert.swal("Formulario Incompleto.", "Este numero de cedula de ciudadania ya esta registrado.", "error");
            $state.go("profile.basic"); 
            return; 
        }

        if(!$rootScope.user.data.numero_cuentas_bancaria){
            $scope.bank.numero_cuentas_bancaria.$setValidity('required', false);

        }else{
          $scope.bank.numero_cuentas_bancaria.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.tarjeta_credito){
            $scope.bank.tarjeta_credito.$setValidity('required', false);

        }else{
          $scope.bank.tarjeta_credito.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.banco_desembolso){
            $scope.bank.banco_desembolso.$setValidity('required', false);

        }else{
          $scope.bank.banco_desembolso.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.tipo_cuenta){
            $scope.bank.tipo_cuenta.$setValidity('required', false);

        }else{
          $scope.bank.tipo_cuenta.$setValidity('required', true);
        }  

        if($scope.bank.$invalid){
            modal.incompleteForm();
            $scope.bank.$setSubmitted();
            return ;
        }   

        $state.go("profile.resumen");      
    }

    $scope.go_to_finance = function(){
        if(!$rootScope.user.data.departamento){
            $scope.location.departamento.$setValidity('required', false);
        }else{
          $scope.location.departamento.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.departamento){
            $scope.location.ciudad.$setValidity('required', false);

        }else{
          $scope.location.ciudad.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.tipo_vivienda){
            $scope.location.vivienda.$setValidity('required', false);

        }else{
          $scope.location.vivienda.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.estrato){
            $scope.location.estrato.$setValidity('required', false);

        }else{
          $scope.location.estrato.$setValidity('required', true);
        } 

        if($scope.location.$invalid){
            modal.incompleteForm();
            $scope.location.$setSubmitted();
            return ;
        }   

        $state.go("profile.finance");
    }

    $scope.go_to_references = function(){
        if(!$rootScope.user.data.fecha_nacimiento){
            $scope.profile.fecha_nacimiento.$setValidity('required', false);

        }else if(($rootScope.user.data.fecha_nacimiento) &&  (!$rootScope.user.data.fecha_nacimiento.day || !$rootScope.user.data.fecha_nacimiento.month || !$rootScope.user.data.fecha_nacimiento.year)){
            $scope.profile.fecha_nacimiento.$setValidity('required', false);
        }else{
            $scope.profile.fecha_nacimiento.$setValidity('required', true);
        }

        if(!$rootScope.user.data.fecha_nacimiento){
            $scope.profile.fecha_nacimiento.$setValidity('required', false);

        }else if(($rootScope.user.data.fecha_expedicion) &&  (!$rootScope.user.data.fecha_expedicion.day || !$rootScope.user.data.fecha_expedicion.month || !$rootScope.user.data.fecha_expedicion.year)){
            $scope.profile.fecha_expedicion.$setValidity('required', false);
        }else{
            console.log("scope", $scope);
            $scope.profile.fecha_expedicion.$setValidity('required', true);
        }



        if(!$rootScope.user.data.ciudad_expedicion){
            $scope.profile.ciudad_expedicion.$setValidity('required', false);

        }else{
          $scope.profile.ciudad_expedicion.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.sexo){
            $scope.profile.sexo.$setValidity('required', false);

        }else{
          $scope.profile.sexo.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.estado_civil){
            $scope.profile.estado_civil.$setValidity('required', false);

        }else{
          $scope.profile.estado_civil.$setValidity('required', true);
        }

        if($scope.profile.$invalid){
            modal.incompleteForm();
            $scope.profile.$setSubmitted();
            return ;
        } 

        if(!$rootScope.user.data.updated){
            $scope.document_exist(function(response){
                if(response.exists > 0){
                     sweetAlert.swal("Formulario Incompleto.", "Este numero de cedula de ciudadania ya esta registrado.", "error");
                     $state.go('profile.basic');
                     $rootScope.cc_exist = true;
                     return;
                }else{
                    delete $rootScope.cc_exist;
                    $state.go('profile.references')
                }
            });            
        }  
        
         $state.go('profile.references')
    }

    $scope.go_to_location = function(){
        if(!$rootScope.user.data.rfname){
            $scope.references.rfname.$setValidity('required', false);
        }else{
          $scope.references.rfname.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.rflastname){
            $scope.references.rflastname.$setValidity('required', false);

        }else{
          $scope.references.rflastname.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.rfphone){
            $scope.references.rfphone.$setValidity('required', false);

        }else{
          $scope.references.rfphone.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.rcname){
            $scope.references.rcname.$setValidity('required', false);
        }else{
          $scope.references.rcname.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.rclastname){
            $scope.references.rclastname.$setValidity('required', false);

        }else{
          $scope.references.rclastname.$setValidity('required', true);
        } 

        if(!$rootScope.user.data.rcphone){
            $scope.references.rfphone.$setValidity('required', false);

        }else{
          $scope.references.rfphone.$setValidity('required', true);
        } 

        if($scope.references.$invalid){
            modal.incompleteForm();
            $scope.references.$setSubmitted();
            return ;
        }

         $state.go("profile.location");

    }

    $scope.counter = 5;
    
    $scope.onTimeout = function(){
    
    if($scope.counter == 0){
        $scope.stop()

        var data = {};
        data._user = $rootScope.user._id;
        data._credit = $rootScope.current_credit._id;

        api.contracts().post(data).success(function(res){
            if(res){
                $state.go('dashboard.new_credit', { with_offer : true});
            }
        });

        return;
    }
        $scope.counter--;
        $scope.mytimeout = $timeout($scope.onTimeout, 1000);
    }

    $scope.viewContract = function(){
          Handlebars.registerHelper('formatCurrency', function(value) {
              return $filter('currency')(value);
          });

          $http.get('views/prints/contract.html').success(function(res){
                var _template = Handlebars.compile(res);

                var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
                
                w.document.write(_template({}));
                w.print();
                w.close();
          });
    }

    $scope.document_exist = function(callback){
        if($rootScope.user.cc && ($scope.old_cc != $rootScope.user.cc)){
            api.user().add("documento/" + $rootScope.user.cc).get().success(callback);
        }else{
            $state.go("profile.location");            
        }
    }

    $scope.logout = function(){
      window.localStorage.clear();
      
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('home');
    }

    $scope.parseCC =  function(){
        $rootScope.user.cc = parseInt($rootScope.user.cc);
    }

    $scope.go_to = function(state){
            $state.go(state);
    }
        
    $scope.stop = function(){
        $timeout.cancel($scope.mytimeout);
    }

    $scope.go_back = function(){
        window.history.back();
    }

    $scope.update = function(){
        var error_stack = [];


        if($rootScope.cc_exist){
            sweetAlert.swal("Formulario Incompleto.", "Este numero de cedula de ciudadania ya esta registrado.", "error");
            $state.go("profile.basic"); 
            return; 
        }

        if(!$rootScope.user.data.ingresos_totales){
            error_stack.push("Ingresos"); 
        }

        if(!$rootScope.user.name){
            error_stack.push("Nombres");
        } 

        if(!$rootScope.user.last_name){
            error_stack.push("Apellidos");
        } 

        if(!$rootScope.user.data.egresos_totales){
            error_stack.push("Egresos");
        }

        if(!$rootScope.user.cc){
            error_stack.push("Cedula de ciudadania");
        }

        if(!$rootScope.user.data.phone){
            error_stack.push("Telefono Celular");
        }

        if(!$rootScope.user.data.sexo){
            error_stack.push("Sexo");
        }

        if(!$rootScope.user.email){
            error_stack.push("Email");
        }

        if(!$rootScope.user.data.ciudad){
            error_stack.push("Ciudad");
        }

        if(!$rootScope.user.data.departamento){
            error_stack.push("Departamento");
        }

        if(!$rootScope.user.data.fecha_nacimiento || !$rootScope.user.data.fecha_nacimiento.day || !$rootScope.user.data.fecha_nacimiento.month || !$rootScope.user.data.fecha_nacimiento.year ){
            error_stack.push("Fecha de nacimiento");
        }

        if(!$rootScope.user.data.fecha_expedicion || !$rootScope.user.data.fecha_expedicion.day || !$rootScope.user.data.fecha_expedicion.month || !$rootScope.user.data.fecha_expedicion.year){
            error_stack.push("Fecha de expedición");
        }

        if(!$rootScope.user.data.numero_cuenta){
            error_stack.push("Numero de cuenta");
        }

        if(!$rootScope.user.data.ocupacion){
            error_stack.push("Ocupación");
        }


        if(!$rootScope.user.data.direccion){
            error_stack.push("Dirección");
        }

        if(!$rootScope.user.data.numero_cuentas_bancaria){
            error_stack.push("Numero de cuentas bancarias");
        }

        if(!$rootScope.user.data.perfil_actual){
            error_stack.push("Perfil actual");
        }

        if(!$rootScope.user.data.tarjeta_credito){
            error_stack.push("Tarjeta de credito");
        }

        if(!$rootScope.user.data.tipo_cuenta){
            error_stack.push("Tipo de cuenta");
        }

        if(!$rootScope.user.data.estrato){
            error_stack.push("Estrato");
        }

        if(!$rootScope.user.data.tipo_vivienda){
            error_stack.push("tipo de vivienda");
        }

        if(!$rootScope.user.data.nivel_estudio){
            error_stack.push("Nivel de estudio");
        }

        if(!$rootScope.user.data.banco_desembolso){
            error_stack.push("Banco Donde recibiras el dinero");
        }

        if(error_stack.length > 0){
            var text = SmartPhone.isAny() ? 'Todos los campos son requeridos por favor verifique.'  : "estos campos son obligatorios: " + error_stack.join(", ")
           sweetAlert.swal("Formulario Incompleto.", text, "error");
           error_stack.length = 0;
           return;
        }


        if(!$rootScope.user.data.updated){
            $scope.document_exist(function(response){
                if(response.exists > 0){
                     sweetAlert.swal("Formulario Incompleto.", "Este numero de cedula de ciudadania ya esta registrado.", "error");
                     $state.go('profile.basic');
                     $scope.cc_exist = true;
                     return;
                }
            });            
        }

        if($rootScope.user.data.updated){
              delete $rootScope.user.data.ingresos_obj.$order;
              delete $rootScope.user.data.egresos_obj.$order;

                api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                    $state.go('dashboard');
                    return; 
                }); 

                return; 
        }else{
            swal({
                allowEscapeKey  : false,
                html: true,
                title: 'TERMINOS Y CONDICIONES',
                text:'<textarea rows="5" readonly style="width: 100%;font-size: 10px;font-weight: lighter;">Es requisito necesario para la adquisición de los productos que se ofrecen en este sitio, que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan.'+
            'El presente documento se presenta en cumplimiento de las disposiciones de la ley 1581 de 2012 y sus decretos reglamentarios. En esa medida la recolección y tratamiento de los datos personales de nuestros clientes, usuarios y empleados está sujeta a las normas vigentes en la República de Colombia sobre protección de datos personales.' +
            'Identificación del Responsable de la Base de Datos Personales. DAIMONT S.A.S, sociedad de carácter comercial identificada con NIT. 901091741-7, domiciliada en la Carrera 16 N 30 A 55, ciudad de Sincelejo, Sucre; correo electrónico soporte@daimont.com, teléfono de contacto 311 695 7745.' +
            'Uso de la Información Personal. Como parte de las actividades de prestación de servicios de DAIMONT S.A.S, en particular estudio y otorgamiento de créditos, cobranza, actualización de datos, reporte a centrales de riesgo, contacto a clientes y usuarios, será requerida la entrega de datos tales como nombre, dirección, edad, así como otra información de contacto como número de teléfono y dirección electrónica e información específica en torno a referencias y condiciones económicas de los titulares de la información, así como otra información relevante proveniente del titular y las redes sociales de internet que nos permiten conocer a nuestros clientes y usuarios y facilitan el ejercicio de las actividades propias de la entidad.' +
            'Finalidades del Tratamiento de la Información. La información será tratada por DAIMONT S.A.S de acuerdo con las siguientes finalidades:' +
            'Realizar ante los operadores de información (Datacrédito, Cifin y/o cualquier otra entidad que llegue a manejar bases de datos con los mismos objetivos) la consulta de la información crediticia, así como el reporte de la generación, modificación, extinción, cumplimiento o incumplimiento de las obligaciones contraídas en favor de DAIMONT S.A.S y la utilización indebida de los productos y/o servicios prestados u ofrecidos por la entidad.' +
            'Compartir e intercambiar con sus entidades filiales, matrices, aliadas y/o con entidades financieras, la información personal contenida en las bases de datos de la entidad con fines de control de riesgos, desembolso y pago de obligaciones, comerciales, estadísticos y la realización de actividades de mercadeo de sus servicios y publicidad.' +
            'Utilizar los comentarios, artículos, fotos, videos y otros contenidos que se publican por los clientes o usuarios en nuestra página de internet, o que se presentan por cualquier otro medio de comunicación de DAIMONT S.A.S para la realización de actividades comerciales o de mercadeo a través de nuestra página de internet, Facebook y otros medios de comunicación y utilizarlos como parte de nuestras campañas comerciales o de mercadeo dirigidas al público en general a través de distintos medios de comunicación.' +
            'Adelantar contactos con fines comerciales y promocionales ya sea sobre sus propios servicios y productos, o los de terceros con los que DAIMONT S.A.S tenga relaciones comerciales o alianzas, a través de correo, teléfono, celular, correo electrónico o cualquier otro medio conocido o por conocer. Realizar actividades de gestión de cobro, aviso de reporte a las centrales de riesgo, entrega de extractos de obligaciones y actualizar la información a través de diferentes actividades como lo son la consulta en bases de datos públicas, páginas de internet y redes sociales y referencias de terceras personas.' +
            'El tratamiento de la información podrá realizarse por DAIMONT S.A.S directamente o a través de terceros proveedores localizados en Colombia o en el exterior. Ese proceso puede implicar la recolección, archivo, procesamiento y transmisión de dicha información entre compañías vinculadas o relacionadas contractualmente con DAIMONT S.A.S tales como proveedores del servicio de call y contact center, proveedores del servicio de mensajería, empresas de cobranza y profesionales del derecho que colaboran con la entidad para la recuperación de su cartera, localizadas dentro o fuera de Colombia. En todo caso, esas entidades estarán igualmente sujetas a las mismas obligaciones de confidencialidad en el manejo de la información a que está sujeto el DAIMONT S.A.S con las limitaciones legales impuestas por las leyes aplicables sobre la materia, en la jurisdicción donde ésta se recolecte, archive, procese o transmita.' +
            'Se garantiza que DAIMONT S.A.S, directamente, no utilizará o tratará para fines diferentes de los indicados, la información personal que contengan las bases de datos de nuestros clientes, usuarios y empleados.' +
            'Datos de Menores. DAIMONT S.A.S no recopila ni trata datos de menores de edad. En caso de llegar a hacerlo y en virtud del régimen legal de protección de datos personales vigentes en Colombia, DAIMONT S.A.S velará por el uso adecuado de los mismos en observancia de los principios y obligaciones contemplados en la Legislación Colombia de tratamiento de datos personales En garantía de los derechos fundamentales que le asisten a los niños y niñas o menores de edad y en caso que se deba obtener una información que verse sobre ellos, le asistirá al representante legal o acudiente dar la respectiva autorización previo ejercicio del menor de su derecho a ser escuchado, reservándose DAIMONT S.A.S la posibilidad de dar conocimiento a las Autoridades pertinentes sobre situaciones que a su criterio causen o lleguen a causar una vulneración a los derechos de un menor de edad.' +
            'Tipos de Datos Tratados. DAIMONT S.A.S en desarrollo de sus actividades comerciales y civiles capta y trata datos personales que son pertinentes y adecuados para la finalidad para la cual son recolectados o requeridos, los cuales conforme a la normatividad vigente y en virtud a nuestra actividad comercial son básicamente: 1. Datos públicos; 2. Datos semi- privados Y 3. Datos privados.' +
            'Datos lo cuales contienen información de naturaleza personal como los relativos al estado civil de las personas, a su profesión u oficio , a su historial crediticio, comercial y financiero, pertinentes para la actividad y los servicios /productos que ofertamos al público.' +
            'Datos Sensibles. En desarrollo de sus actividades DAIMONT S.A.S no almacena o trata datos que se puedan considerar sensibles y que no resulten adecuados para sus labores comerciales. Sin embargo, En caso de requerirse este tipo de información para el adecuado desarrollo de las actividades adelantadas por DAIMONT S.A.S los titulares deberán otorgar su autorización expresa, la cual deberá hacerse siempre de manera libre y voluntaria.' +
            'Las respuestas a las preguntas que sean efectuadas a los titulares en torno a información sensible serán facultativas y en este caso se informará previamente al titular que información sensible se está capturando y el objeto de su tratamiento.' +
            'Terceros y la Información Personal. Como se establece dentro de las finalidades con las cuales se recolecta y trata la información personal, DAIMONT S.A.S. para la adecuada prestación de sus servicios, acudirá en ocasiones a personas naturales o jurídicas para que con su colaboración se puedan realizar adecuadamente todas las labores y se preste el mejor servicio a sus clientes. Eso implica en ocasiones la necesidad de que esos terceros tengan acceso a determinada información personal mantenida en las bases de datos de la entidad. En tal caso, DAIMONT S.A.S. velará porque: 1. Toda información que se entregue a un tercero este precedida de un acuerdo en donde consten sus obligaciones de confidencialidad y seguridad en el tratamiento de la información, las cuales serán, al menos similares a las establecidas por la entidad en sus procesos; 2. La información sólo sea utilizada para el cumplimiento de las finalidades establecidas en esta políticas; 3. Sólo se comparte la información estrictamente necesaria para el cumplimiento de las funciones del tercero.' +
            'Derechos de los Titulares y su Ejercicio. Los titulares de los datos personales tienen derecho a: 1. Conocer, actualizar y rectificar sus datos personales. Este derecho se podrá ejercer, entre otros frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté expresamente prohibido o no haya sido autorizado; Solicitar prueba de la autorización otorgada, salvo cuando expresamente se exceptúe como requisito para el Tratamiento;Ser informados, previa solicitud, respecto del uso que se le ha dado a sus datos personales; 2. Revocar la autorización y/o solicitar la supresión del dato cuando en el Tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. Sin embargo, tal revocatoria o la eliminación de la información no serán procedentes mientras se mantenga una relación de tipo comercial o legal con DAIMONT S.A.S. 3. Acceder en forma gratuita a los datos personales que hayan sido objeto de tratamiento una vez al mes o cada vez que existan modificaciones sustanciales a estas políticas de tratamiento de la información que motiven nuevas consultas.' +
            'Para el ejercicio de estos derechos, el titular podrá contactarse con DAIMONT S.A.S a través de comunicación escrita dirigida a nuestra área de atención al cliente a través del correo electrónico: soporte@daimont.com' +
            'La comunicación referida deberá contener todos los datos necesarios para efectos de garantizar la oportuna y efectiva respuesta, acompañada de una descripción precisa de los datos personales respecto de los cuales el titular busca ejercer alguno de sus derechos. Es de anotar que la solicitud de eliminación de los datos significará que los mismos no podrán ser accesibles para el desarrollo de las operaciones normales de la entidad, sin embargo podrán mantenerse en sus archivos con fines estadísticos, históricos, conocimiento de sus clientes o atención de requerimiento de autoridades administrativas o judiciales.' +
            'Información de Terceros. La recepción de la información entregada por los clientes de DAIMONT S.A.S. o terceras personas debe estar precedida de las debidas autorizaciones por parte de los titulares de la información. De esta manera, DAIMONT S.A.S. entiende que quien realiza entrega de información a la entidad para la realización de sus actividades empresariales cuenta con todas las autorizaciones pertinentes para su tratamiento y en ese sentido libera a DAIMONT S.A.S. de cualquier responsabilidad por el uso que le dé a los datos de acuerdo con las finalidades para las cuales se le hace entrega de la información. Si la información entregada incluye cualquier tipo de dato personal correspondiente a terceros, como es el caso de la entrega de personas que sirven de referencia comercial, tendrá que asegurarse de contar con todas las autorizaciones por parte de sus titulares para su verificación y posterior contacto.' +
            'Información publicada o trasmitida para DAIMONT S.A.S. La entrega de información o conocimiento de datos personales a través de nuestro portal web o redes sociales mediante comentarios, artículos, blogs o demás métodos de compartir información permitida por las paginas, le hace presumir a DAIMONT S.A.S. que se cuenta con todas las autorizaciones por parte de sus titulares para compartir la información, por lo que no nos hacemos responsables de denuncias, reclamos u otras manifestaciones sobre los datos que se nos entreguen por estos medios, salvo para efectuar su publicación o eliminación.' +
            'Lo dicho en el entendido de que al momento de compartir a DAIMONT S.A.S. información personal mediante comentarios, imágenes, videos, grabaciones y demás medios en nuestras páginas certificadas, la persona que nos entregue tal información nos autoriza para hacer uso de la misma en nuestros portal de internet, redes sociales, campañas de mercadeo/publicitarias/promocionales dirigidas al público en general por los diferentes medio de comunicación, presumiéndose la autorización del titular de la información para que ésta haya sido compartida a Nosotros por tales medios masivos.' +
            'Veracidad. DAIMONT S.A.S. asume que la información entregada por sus clientes y usuarios es completa, actual y veraz, resultando de su entera responsabilidad cualquier disconformidad entre los datos entregados y la realidad. Como titular de los datos nuestros clientes y usuarios se encuentran comprometidos a notificarnos de cualquier cambio en la información suministrada en el proceso de aplicación o durante la duración de la relación comercial entre las partes.' +
            'Seguridad en Internet.DAIMONT S.A.S. el respeto de la privacidad y de la seguridad de los datos de nuestros clientes y usuarios es fundamental y estamos conscientes de la confianza que depositan en nosotros al requerir nuestros servicios, por eso, tomamos todas las medidas de seguridad necesarias para proteger sus datos. No obstante lo anterior, es una responsabilidad de nuestros clientes o usuarios implementar los controles de seguridad necesarios, en sus equipos y redes privadas para su navegación hacia el portal de DAIMONT S.A.S. o para él envió de correos electrónicos. De esta manera DAIMONT S.A.S. no se responsabiliza por cualquier consecuencia derivada del ingreso fraudulento por parte de terceros a la base de datos y por alguna falla técnica en el funcionamiento que sobrepasen las actividades desarrolladas con la diligencia debida.' +
            'Modificaciones a la política de tratamiento de la Información. DAIMONT S.A.S. se reserva el derecho de modificación de la presente política de tratamiento de la información de carácter personal, en cualquier tiempo y de manera unilateral. Para tal efecto y en acatamiento del mandato legal aplicable (Inciso final del artículo 13 del Decreto 1377 de 2013), se realizará previo a la adopción de las modificaciones, la publicación de un aviso en la página de internet de DAIMONT S.A.S. con diez (10) días hábiles de antelación a la entrada en vigencia de la modificaciones o adiciones de la PTI. En el supuesto de que no se esté de acuerdo por razones válidas y que se constituyan en una justa causa, con las nuevas políticas de manejo de la información personal que se va a implementar, los titulares de la información o sus representantes legales podrán solicitar la supresión de sus datos a través del trámite referido para el ejercicio de los derechos que le asisten, esto en el entendido que sus solicitudes de eliminación no serán procedentes mientras exista vinculo o relación legal de cualquier tipo con DAIMONT S.A.S..' +
            'Jurisdicción Aplicable. Todo asunto, actuación pre jurídica, judicial o administrativa derivada del tratamiento de la información que aplique DAIMONT S.A.S. a los datos de clientes, usuarios y empleados, así como los asuntos atinentes a la presente PTI, estarán sujetos para su resolución al régimen legal para el tratamiento de información personal aplicable en la República de Colombia a sus autoridades judiciales y administrativas, a las personas nacionales y extranjeras que se rijan por los mandatos de la jurisdicción Colombiana.' +
            'Esta Política de tratamiento de la información personal –PTI- se publica y entra en vigencia para todos los efectos el NUEVE (09) de OCTUBRE (10) del año DOS MIL DIECISIETE (2017), válida en todas sus condiciones por periodo indeterminado.' +
            'Daimont S.A.S NIT 901091741-7</textarea>',
                showCancelButton: true,
                confirmButtonColor: '#00989e',
                confirmButtonText: 'SI, Acepto!',
                cancelButtonText: "NO, Salir!",
                closeOnConfirm: true,
                closeOnCancel: true
             },
             function(isConfirm){
               if (isConfirm){
                        $rootScope.user.data.terms = true;
                        $rootScope.updating = true;

                           delete $rootScope.user.data.ingresos_obj.$order;
                              delete $rootScope.user.data.egresos_obj.$order;
                                if( $rootScope.user.data.cf){
                                    delete $rootScope.user.data.cf.$id;
                                    delete $rootScope.user.data.cf.$priority;
                                }
                                if( $rootScope.user.data.cl){
                                    delete $rootScope.user.data.cl.$id;
                                    delete $rootScope.user.data.cl.$priority; 
                                }
                                if( $rootScope.user.data.ca){
                                     delete $rootScope.user.data.ca.$id;
                                    delete $rootScope.user.data.ca.$priority; 
                                }

                                if( $rootScope.user.data.dt){
                                    delete $rootScope.user.data.dt.$id;
                                    delete $rootScope.user.data.dt.$priority; 
                                }

                                if( $rootScope.user.data.dt2){
                                    delete $rootScope.user.data.dt2.$id;
                                    delete $rootScope.user.data.dt2.$priority; 
                                }

                                if( $rootScope.user.data.ce){
                                    delete $rootScope.user.data.ce.$id;
                                    delete $rootScope.user.data.ce.$priority; 
                                }

                                if( $rootScope.user.data.ex){
                                    delete $rootScope.user.data.ex.$id;
                                    delete $rootScope.user.data.ex.$priority; 
                                }

                                if( $rootScope.user.data.ex2){
                                    delete $rootScope.user.data.ex2.$id;
                                    delete $rootScope.user.data.ex2.$priority;  
                                }

                                if( $rootScope.user.data.re){
                                    delete $rootScope.user.data.re.$id;
                                    delete $rootScope.user.data.re.$priority;  
                                }


                        if($rootScope.user.data.ingresos_obj && $rootScope.user.data.egresos_obj){
                            var _result = ($rootScope.user.data.ingresos_obj.number - $rootScope.user.data.egresos_obj.number);
                            var _cupon = 0; 

                            if(_result <= 1){
                                _cupon = 140000;
                            }else if(_result >= 499999 ||  _result < 1000000){
                                _cupon = 140000;
                            }else if( _result >= 1500000){
                                _cupon = 200000;
                            }  

                            $rootScope.user.data.cupon = _cupon;                      
                        }

                        $rootScope.user.data.updated = true;

                        if(!$rootScope.user.credit){
                              delete $rootScope.user.data.ingresos_obj.$order;
                              delete $rootScope.user.data.egresos_obj.$order;

                              api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                                    $state.go('dashboard.new_credit', { with_offer : true }, { reload : true });
                                    return;
                              });

                            $rootScope.updating = false;

                        }else{
                            if($rootScope.user.credit.data.amount[0] <= _cupon){
                                $rootScope.user.credit._user = $rootScope.user._id;

                                  api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                                        $rootScope.user.updated = true;
                                        localStorage.user = JSON.stringify($rootScope.user);
                                        $scope.updated = true;
                                        
                                        api.credits().post($rootScope.user.credit).success(function(res){
                                              modal.confirm({
                                                         closeOnConfirm : true,
                                                         confirmButtonText: "OK",
                                                         title: "Resumen Enviado.",
                                                         showCancelButton: false,
                                                         showLoaderOnConfirm: true,
                                                         text: "Enviamos correo con el resumen del crédito a su correo, por favor léalo cuidadosamente antes de realizar la firma electrónica, el correo puede llegar en su bandeja de entrada o correo no deseado..",
                                                         confirmButtonColor: "#008086",
                                                         type: "success" },
                                                         function(isConfirm){ 
                                                            if (isConfirm) {
                                                                    $rootScope.updating = false;

                                                                    api.credits().add("email_request/" + res._id).get().success(function(res){
                                                                      if(res){
                                                                            $state.go('dashboard', { without_offer : true }, { reload : true });
                                                                      }
                                                                    }); 
                                                            }
                                                  });  
                                        });                                       
                                  });
                            }

                            if($rootScope.user.credit.data.amount[0] > _cupon){
                                delete $rootScope.user.credit;

                                api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                                    if(res){
                                        $rootScope.user.updated = true;
                                        localStorage.user = JSON.stringify($rootScope.user);
                                        $scope.updated = true;
                                        $state.go('dashboard.new_credit', { with_offer : true} , { reload : true });
                                    }
                                }); 

                                /*api.credits().add("current").get().success(function(res){
                                    if(res){
                                        $rootScope.current_credit = res;
                                        $scope.updateOfferCredit = res;
                                        $scope.updateOfferCredit.data.with_offer = true;
                                        $scope.updateOfferCredit.data.offer = true;

                                        api.credits($scope.updateOfferCredit._id).put($scope.updateOfferCredit).success(function(res){

                                        });
                                    }
                                })*/

                                $rootScope.updating = false;
                            }
                          
                          delete $rootScope.user.data.ingresos_obj.$order;
                          delete $rootScope.user.data.egresos_obj.$order;
                        }                       
                } else {
                    $scope.logout();
                }
             }); 
        }
    }

    $scope.logout = function(){
        window.localStorage.clear();
      
        delete $rootScope.isLogged;
        delete $rootScope.user;

         $state.go('home');
    }
  });