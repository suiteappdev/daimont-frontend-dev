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