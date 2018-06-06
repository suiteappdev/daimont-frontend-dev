'use strict';

angular.module('shoplyApp')
  .directive('audioPlayer', function () {
  	function ctrl($scope, api, modal, $rootScope){

    }

    return {
      template: '<audio controls><source type="audio/mpeg">Your browser does not support the audio element.</audio>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        audio : "=",
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {
        var audio =  angular.element(element)[0];
        audio  = audio.children[0];
        audio.src = scope.audio.path;
        audio.load(); 
      }
    };
  });