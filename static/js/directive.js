app.directive('commonhead', function(){
	return {
		restrict: 'AE',
		//$scope: {},
		templateUrl: 'temp/header.html',
		replace: true,
		controller: 'header',
	}
});

app.directive('profile', function () {
	return {
		restrict: 'AE',
		templateUrl: 'temp/profile.html',
		replace: true,
		controller: 'profile'
	}
})