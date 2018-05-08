'use strict';
angular.module('shoplyApp')
  .directive('daimontHeader', function ($timeout) {
      return {
          templateUrl: 'views/layout/daimont-header.html',
          restrict: 'EA',
          link: function postLink(scope, element, attrs) {
		        if(!toggle_initialized){
		        	$timeout(function(){
              				window.nowuiKit.initRightMenu()
		        	}, 1000);
		        }
  		}
  	};
});
