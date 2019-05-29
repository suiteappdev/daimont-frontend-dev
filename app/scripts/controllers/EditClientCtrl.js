'use strict';

angular.module('shoplyApp').controller('EditClientCtrl', function ($scope, $rootScope, sweetAlert, constants, $state, modal, api, storage, $stateParams, $http, $filter, $firebaseObject, Firebase, $firebaseArray, $window, $firebaseStorage, account) {
    $scope.Records  = false;
    $scope.records = [];

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
            $scope.client.data.ingresos_obj = angular.copy($scope.ingresos_records.filter(function(obj){
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
                $scope.client.data.egresos_obj = angular.copy($scope.egresos_records.filter(function(obj){
                    return obj.value == value;
                })[0]);
            } 
    };

    $scope.changePwd = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas cambiar la contraseña de esta cuenta?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: false
        },
        function(){
            var form  = {};
            form.newpwd = $scope.newpwd;
            form.confirmpwd = form.newpwd;

            account.usuario().password_reset(angular.extend(form, { id : $scope.client._id })).then(function(res){
                if(res){
                sweetAlert.swal("Cambio de clave!", "se ha cambiado correctamente", "success");

                }
            }, function(status){
                if(status == 404){
                 sweetAlert.swal({
                        title: "Formulario no completado",
                        text: "El usuario no existe",
                        type: "error"
                    })
                }
            })
        });
    }


    $scope.upload_cf = function(){
      $('#cf').click();
    }

    $scope.upload_cl = function(){
      $('#cl').click();
    }

    $scope.upload_call = function(){
      $('#call').click();
    }

    $scope.$watch("cf", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.cf.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.cf);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                          var data = {
                            filename : $scope.cf.name,
                            size : $scope.cf.size,
                            path : snapshot.downloadURL,
                            type : 'cf',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);

                        $scope.client.data.cf = data; 

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.cf.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.cf);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                          var data = {
                            filename : $scope.cf.name,
                            size : $scope.cf.size,
                            path : snapshot.downloadURL,
                            type : 'cf',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);

                        $scope.client.data.cf = data; 

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });


    $scope.$watch("cl", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.clm.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.clm);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                        var data  = {
                            filename : $scope.clm.name,
                            size : $scope.clm.size,
                            path : snapshot.downloadURL,
                            type : 'cl',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };



                        $scope.files.$add(data);
                        $scope.client.data.cl = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.clm.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.clm);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                        var data  = {
                            filename : $scope.clm.name,
                            size : $scope.clm.size,
                            path : snapshot.downloadURL,
                            type : 'cl',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.cl = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("call_model", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/calls/" + $scope.client._id + "/" + $scope.call.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.call_reader);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running', progress);
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                        var data  = {
                            filename : $scope.call_reader.name,
                            size : $scope.call_reader.size,
                            path : snapshot.downloadURL,
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.calls.$add(data);
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/calls/" + $scope.client._id + "/" + $scope.call_reader.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.call_reader);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    console.log('Upload is running', progress);
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                        var data  = {
                            filename : $scope.call_reader.name,
                            size : $scope.call_reader.size,
                            path : snapshot.downloadURL,
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.calls.$add(data);
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("ca", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.cam.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.cam);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                        var data = {
                            filename : $scope.cam.name,
                            size : $scope.cam.size,
                            path : snapshot.downloadURL,
                            type : 'ca',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        } ;

                        $scope.files.$add(data);
                        $scope.client.data.ca = data;

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.cam.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.cam);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.cam.name,
                            size : $scope.cam.size,
                            path : snapshot.downloadURL,
                            type : 'ca',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        }
                        $scope.files.$add(data);

                        window.sweetAlert.close();
                       $scope.client.data.ca = data;

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("dt", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.dt.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.dt);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.dt.name,
                            size : $scope.dt.size,
                            path : snapshot.downloadURL,
                            type : 'dt',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.dt = data;

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.dt.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.dt);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.dt.name,
                            size : $scope.dt.size,
                            path : snapshot.downloadURL,
                            type : 'dt',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.dt = data;

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("dt2", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.dt2.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.dt2);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.dt2.name,
                            size : $scope.dt2.size,
                            path : snapshot.downloadURL,
                            type : 'dt2',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.dt2 = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.dt2.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.dt2);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.dt2.name,
                            size : $scope.dt2.size,
                            path : snapshot.downloadURL,
                            type : 'dt2',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.dt2 = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });


    $scope.$watch("ce", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.ce.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.ce);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.ce.name,
                            size : $scope.ce.size,
                            path : snapshot.downloadURL,
                            type : 'ce',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                          $scope.client.data.ce = data;

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.ce.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.ce);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.ce.name,
                            size : $scope.ce.size,
                            path : snapshot.downloadURL,
                            type : 'ce',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        window.sweetAlert.close();
                        $scope.client.data.ce = data;

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("ex", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.ex.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.ex);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.ex.name,
                            size : $scope.ex.size,
                            path : snapshot.downloadURL,
                            type : 'ex',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.ex = data;

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.ex.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.ex);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.ex.name,
                            size : $scope.ex.size,
                            path : snapshot.downloadURL,
                            type : 'ex',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                          $scope.client.data.ex = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("ex2", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.ex2.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.ex2);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.ex2.name,
                            size : $scope.ex2.size,
                            path : snapshot.downloadURL,
                            type : 'ex2',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                          $scope.client.data.ex2 = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.ex2.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.ex2);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.ex2.name,
                            size : $scope.ex2.size,
                            path : snapshot.downloadURL,
                            type : 'ex2',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                          $scope.client.data.ex2 = data;

                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.$watch("re", function(o, n){
      if(n){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.re.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.re);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.re.name,
                            size : $scope.re.size,
                            path : snapshot.downloadURL,
                            type : 're',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        }

                        $scope.files.$add(data);
                        $scope.client.data.re = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }

      if(o){
            swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.re.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.re);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                      var data = {
                            filename : $scope.re.name,
                            size : $scope.re.size,
                            path : snapshot.downloadURL,
                            type : 're',
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        };

                        $scope.files.$add(data);
                        $scope.client.data.re = data;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.upload_ca = function(){
        $('#ca').click();
    }


    $scope.upload_cf = function(){
        $('#cf').click();
    }


    $scope.upload_dt = function(){
        $('#dt').click();
    }

  $scope.upload_dt2 = function(){
        $('#dt2').click();
    }

  $scope.upload_re = function(){
        $('#re').click();
    }

    $scope.upload_ce = function(){
        $('#ce').click();
    }

    $scope.upload_ex = function(){
        $('#ex').click();
    }

    $scope.upload_ex2 = function(){
        $('#ex2').click();
    }




    $scope.removeFile = function(file, prop){
      var _self = file;

        swal({
          title: "Estas seguro?",
          text: "Deseas eliminar este archivo?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: false
        },
        function(){
         firebase.database().ref("files").child($scope.client._id).child(file).remove();
         window.sweetAlert.close();
         delete $scope.client.data[prop];
        });
    }

    $scope.load = function(){
      api.clients($stateParams.client).get().success(function(res){
          $scope.records = [res] || []
          $scope.client = res;
          $scope.Records  = true;

            var refForArray = firebase.database().ref("profileMessages").child(res._id);
            var syncObject = $firebaseObject(refForArray);
            syncObject.$bindTo($scope, "data");
           
            $scope.comments = $firebaseArray(refForArray);

            var refForArrayFiles =  firebase.database().ref("files").child(res._id);
            $scope.files = $firebaseArray(refForArrayFiles);

            var refForArrayCalls =  firebase.database().ref("calls").child(res._id);
            $scope.calls = $firebaseArray(refForArrayCalls);


          $scope.files.$loaded(function(data){
                if(data.length > 0){
                    $scope.client.data.cf = data.filter(function(f){
                      return f.type == 'cf';
                    })[0];

                    $scope.client.data.cl = data.filter(function(f){
                      return  f.type == 'cl';
                    })[0];


                    $scope.client.data.ca = data.filter(function(f){
                      return  f.type == 'ca';
                    })[0];

                    $scope.client.data.dt = data.filter(function(f){
                      return f.type == 'dt' ;
                    })[0];


                    $scope.client.data.dt2 = data.filter(function(f){
                      return f.type == 'dt2' ;
                    })[0]; 
                    
                    $scope.client.data.ce = data.filter(function(f){
                      return f.type == 'ce';
                    })[0];


                    $scope.client.data.ex = data.filter(function(f){
                      return f.type == 'ex' || f.type == 'ex2';
                    })[0];

                    $scope.client.data.ex2 = data.filter(function(f){
                      return f.type == 'ex2' || f.type == 'ex2';
                    })[0];


                    $scope.client.data.re = data.filter(function(f){
                      return f.type == 're';
                    })[0];

                }
          });
      });

      api.clients().add("credit/" + $stateParams.client).get().success(function(res){
        if(res.length > 0){
          console.log("creditos del usuario", res);
            $scope.hasPending = res.filter(function(cre){
                if(cre.data.status == "Consignado" || cre.data.status == "Pagado" || cre.data.status == "Firmado"){
                  return cre;
                }
            }).length > 0 ? true : false;          
        }
      });
    }

    $scope.$watch('file', function(o, n){
      if(n){
          swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                      var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.upload.name);
                      var st = $firebaseStorage(storage);
                      var uploadTask = st.$put($scope.upload);

                     uploadTask.$progress(function(snapshot) {
                              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                              $scope.progress = 'Subiendo archivo ' + progress + '% realizado';
                              switch (snapshot.state) {
                                  case firebase.storage.TaskState.PAUSED:
                                      console.log('Upload is paused');
                                      break;
                                  case firebase.storage.TaskState.RUNNING:
                                      console.log('Upload is running');
                                      break;
                              }
                      }); 

                      uploadTask.$complete(function(snapshot) {
                          $scope.url= snapshot.downloadURL;

                          window.sweetAlert.close();
                          delete $scope.progress;

                      });

                      uploadTask.$error(function(error) {
                          var msg = '';
                          switch (error.code) {
                              case 'storage/unauthorized':
                              msg = 'User does not have permission to access the object.';
                              break;
                              case 'storage/canceled':
                              msg = 'User canceled the upload.';
                              break;
                              case 'storage/unknown':
                              msg = ' Unknown error occurred, Please try later.';
                              break;
                          }
                          delete $scope.progress;

                          window.sweetAlert.close();
                      });
          });
      }

      if(o){
          swal({
            title: "Está Seguro?",
            text: "¿Deseas subir este archivo?",
            type: "info",
            confirmButtonColor: "#008086",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          },
          function(){
                  var storage = firebase.storage().ref("/files/" + $scope.client._id + "/" + $scope.upload.name);
                  var st = $firebaseStorage(storage);
                  var uploadTask = st.$put($scope.upload);
                  
                  uploadTask.$progress(function(snapshot) {
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            $scope.progress = 'Subiendo archivo ' + progress + '% realizado';
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED:
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING:
                                    console.log('Upload is running');
                                    break;
                            }
                    }); 

                    uploadTask.$complete(function(snapshot) {
                        $scope.url= snapshot.downloadURL;
                        
                        $scope.files.$add({
                            filename : $scope.upload.name,
                            size : $scope.upload.size,
                            path : snapshot.downloadURL,
                            createdAt : firebase.database.ServerValue.TIMESTAMP
                        });

                        delete $scope.progress;
                        window.sweetAlert.close();

                    });

                    uploadTask.$error(function(error) {
                        var msg = '';
                        switch (error.code) {
                            case 'storage/unauthorized':
                            msg = 'User does not have permission to access the object.';
                            break;
                            case 'storage/canceled':
                            msg = 'User canceled the upload.';
                            break;
                            case 'storage/unknown':
                            msg = ' Unknown error occurred, Please try later.';
                            break;
                        }

                        delete $scope.progress;
                        window.sweetAlert.close();
                    });
          });
      }
    });

    $scope.upload_file = function(){
          $('#file_upload').click();
    }

    $scope.dowmloadCertificate = function(){
         $window.open('https://daimont.com.co:8443/certificate/' + $scope.client._id, '_blank');
    }

    $scope.update_cupon = function(){
      $scope.user = angular.copy($scope.client);

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

    $scope.blockAccount = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas bloquear temporalmente esta cuenta?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: false
        },
        function(){
            api.user().add("block/" + $scope.client._id).put().success(function(res){
                if(res){
                  swal({
                      title: "Registro modificado",
                      text: "Has bloqueado este cliente satifactoriamente",
                      type: "success",
                      confirmButtonColor: "#008086",
                      closeOnConfirm: false
                    },
                    function(){
                      $state.go("clients");
                      window.sweetAlert.close();
                    });
                }
            });
        });
    }

    $scope.blockAccountTemp = function(){
        swal({
          title: "Digite el numero de dias a bloquear!",
          text: "Días de bloqueo",
          type: "input",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          closeOnConfirm: false,
          inputPlaceholder: "Escriba el numero de dias"
        }, function (inputValue) {
          if (inputValue === false) return false;
          if (inputValue === "") {
            swal.showInputError("You need to write something!");
            return false
          }
        api.user().add("block-temp/" + $scope.client._id).put({ days : parseInt(inputValue)}).success(function(res){
                if(res){
                  swal({
                      title: "Registro modificado",
                      text: "Has bloqueado este temporalmente a este cliente",
                      type: "success",
                      confirmButtonColor: "#008086",
                      closeOnConfirm: false
                    },
                    function(){
                      $state.go("clients");
                      window.sweetAlert.close();
                    });
                }
            });
        });
    }

    $scope.unblockAccountTemp = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas desbloquear a este cliente?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: true
        },
        function(){
            api.user().add("unblock-temp/" + $scope.client._id).put({}).success(function(res){
                    if(res){
                      swal({
                          title: "Registro modificado",
                          text: "Has desbloqueado a este cliente",
                          type: "success",
                          confirmButtonColor: "#008086",
                          closeOnConfirm: false
                        },
                        function(){
                          window.sweetAlert.close();
                        });
                    }
             });
        });
    }

    $scope.unblockAccount = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas desbloquear a este cliente?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: true
        },
        function(){
            api.user().add("unblock/" + $scope.client._id).put({}).success(function(res){
                    if(res){
                          delete $scope.client.data.blocked;
                          delete $scope.client.data.banned_time;
                      swal({
                          title: "Registro modificado",
                          text: "Has desbloqueado a este cliente",
                          type: "success",
                          confirmButtonColor: "#008086",
                          closeOnConfirm: false
                        },
                        function(){
                          window.sweetAlert.close();

                        });
                    }
             });
        });
    }

           /* api.user($rootScope.user._id).put($rootScope.user).success(function(res){
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
            });*/

    $scope.enable_cupo = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas habilitar la opcion de cupo a este cliente?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: true
        },
        function(){
            $scope.client.data.cupon_updated = false;

          delete $scope.client.data.ingresos_obj.$order;
          delete $scope.client.data.egresos_obj.$order;
            if( $scope.client.data.cf){
                delete $scope.client.data.cf.$id;
                delete $scope.client.data.cf.$priority;
            }
            if( $scope.client.data.cl){
                delete $scope.client.data.cl.$id;
                delete $scope.client.data.cl.$priority; 
            }
            if( $scope.client.data.ca){
                 delete $scope.client.data.ca.$id;
                delete $scope.client.data.ca.$priority; 
            }

            if( $scope.client.data.dt){
                delete $scope.client.data.dt.$id;
                delete $scope.client.data.dt.$priority; 
            }

            if( $scope.client.data.dt2){
                delete $scope.client.data.dt2.$id;
                delete $scope.client.data.dt2.$priority; 
            }

            if( $scope.client.data.ce){
                delete $scope.client.data.ce.$id;
                delete $scope.client.data.ce.$priority; 
            }

            if( $scope.client.data.ex){
                delete $scope.client.data.ex.$id;
                delete $scope.client.data.ex.$priority; 
            }

            if( $scope.client.data.ex2){
                delete $scope.client.data.ex2.$id;
                delete $scope.client.data.ex2.$priority;  
            }

            if( $scope.client.data.re){
                delete $scope.client.data.re.$id;
                delete $scope.client.data.re.$priority;  
            }
            api.user().add($scope.client._id).put($scope.client).success(function(res){
                if(res){
                     delete $scope.client.data.cupon_updated;
                  swal({
                      title: "Registro modificado",
                      text: "Has habilitado la opcion de cupo",
                      type: "success",
                      confirmButtonColor: "#008086",
                      closeOnConfirm: false
                    });
                }
            });
        });
    }

    $scope.disable_cupo = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas deshabilitar la opcion de cupo a este cliente?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: true
        },
        function(){
            $scope.client.data.cupon_updated = true;
          delete $scope.client.data.ingresos_obj.$order;
          delete $scope.client.data.egresos_obj.$order;
            if( $scope.client.data.cf){
                delete $scope.client.data.cf.$id;
                delete $scope.client.data.cf.$priority;
            }
            if( $scope.client.data.cl){
                delete $scope.client.data.cl.$id;
                delete $scope.client.data.cl.$priority; 
            }
            if( $scope.client.data.ca){
                 delete $scope.client.data.ca.$id;
                delete $scope.client.data.ca.$priority; 
            }

            if( $scope.client.data.dt){
                delete $scope.client.data.dt.$id;
                delete $scope.client.data.dt.$priority; 
            }

            if( $scope.client.data.dt2){
                delete $scope.client.data.dt2.$id;
                delete $scope.client.data.dt2.$priority; 
            }

            if( $scope.client.data.ce){
                delete $scope.client.data.ce.$id;
                delete $scope.client.data.ce.$priority; 
            }

            if( $scope.client.data.ex){
                delete $scope.client.data.ex.$id;
                delete $scope.client.data.ex.$priority; 
            }

            if( $scope.client.data.ex2){
                delete $scope.client.data.ex2.$id;
                delete $scope.client.data.ex2.$priority;  
            }

            if( $scope.client.data.re){
                delete $scope.client.data.re.$id;
                delete $scope.client.data.re.$priority;  
            }
            api.user().add($scope.client._id).put($scope.client).success(function(res){
                if(res){
                $scope.client.data.cupon_updated = true;
                  swal({
                      title: "Registro modificado",
                      text: "Has deshabilitado la opcion de cupo del usuario",
                      type: "success",
                      confirmButtonColor: "#008086",
                      closeOnConfirm: false
                    });
                }
            });
        });
    }

    $scope.unblockCredit = function(){
        swal({
          title: "Estas seguro?",
          text: "Deseas quitar la restricción de solicitud a este cliente?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          cancelButtonText: "No!",
          confirmButtonText: "Si!",
          closeOnConfirm: false
        },
        function(){
            api.user().add("unblock/" + $scope.client._id).put().success(function(res){
                if(res){
                  swal({
                      title: "Registro modificado",
                      text: "Este cliente ya puede solicitar un nuevo préstamo.",
                      type: "success",
                      confirmButtonColor: "#008086",
                      closeOnConfirm: false
                    },
                    function(){
                      $state.go("clients");
                      window.sweetAlert.close();
                    });
                }
            });
        }); 
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
                            firebase.database().ref("profileMessages").child($scope.client._id).child(_comment.$id).remove()
                     }
          }); 
    }

    $scope.deleteCall = function(){
         var _call = this.call;

         modal.confirm({
                 closeOnConfirm : true,
                 title: "Está Seguro?",
                 text: "Confirma que desea  eliminar este clip de voz ?",
                 confirmButtonColor: "#008086",
                 closeOnConfirm: true,
                 type: "warning" },
                 function(isConfirm){ 
                     if (isConfirm) {
                            firebase.database().ref("calls").child($scope.client._id).child(_call.$id).remove()
                     }
          }); 
    }

    $scope.editComment = function(){
      $scope.editItem = this.comment;
      $scope.comment = $scope.editItem.comment;
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


    $scope.update = function(){
        swal({
          title: "Actualizar Cliente",
          text: "¿confirma que desea actualizar la información de este cliente?",
          type: "info",
          confirmButtonColor: "#008086",
          cancelButtonText: "Cancelar",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function(){
          delete $scope.client.data.ingresos_obj.$order;
          delete $scope.client.data.egresos_obj.$order;
            if( $scope.client.data.cf){
                delete $scope.client.data.cf.$id;
                delete $scope.client.data.cf.$priority;
            }
            if( $scope.client.data.cl){
                delete $scope.client.data.cl.$id;
                delete $scope.client.data.cl.$priority; 
            }
            if( $scope.client.data.ca){
                 delete $scope.client.data.ca.$id;
                delete $scope.client.data.ca.$priority; 
            }

            if( $scope.client.data.dt){
                delete $scope.client.data.dt.$id;
                delete $scope.client.data.dt.$priority; 
            }

            if( $scope.client.data.dt2){
                delete $scope.client.data.dt2.$id;
                delete $scope.client.data.dt2.$priority; 
            }

            if( $scope.client.data.ce){
                delete $scope.client.data.ce.$id;
                delete $scope.client.data.ce.$priority; 
            }

            if( $scope.client.data.ex){
                delete $scope.client.data.ex.$id;
                delete $scope.client.data.ex.$priority; 
            }

            if( $scope.client.data.ex2){
                delete $scope.client.data.ex2.$id;
                delete $scope.client.data.ex2.$priority;  
            }

            if( $scope.client.data.re){
                delete $scope.client.data.re.$id;
                delete $scope.client.data.re.$priority;  
            }

            api.user($scope.client._id).put($scope.client).success(function(res){
                if(res){
                  swal({
                      title: "Registro modificado",
                      text: "Has modificado este registro satifactoriamente",
                      type: "success",
                      confirmButtonColor: "#008086",
                      closeOnConfirm: false
                    },
                    function(){
                      $state.go("clients");
                      window.sweetAlert.close();
                    });
                }
            });
        });
    }

    $scope.parseCC =  function(){
        $scope.client.cc = parseInt($scope.client.cc);
    }

    $scope.credits = function(){

    }

    $scope.getUserCredits = function(){
     api.clients().add("credit/" + $scope.user_credit._id).get().success(function(res){
          $scope.credits_records = res || []
          $scope.Records  = true;
      });
    }

    $scope.logout = function(){
      window.localStorage.clear();
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('/home');
    }
});
