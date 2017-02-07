app.directive('commonhead', function(){
	return {
		restrict: 'AE',
		//$scope: {},
		templateUrl: 'temp/header.html',
		replace: true,
		controller: 'header',
	}
});