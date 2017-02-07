app.controller('main', ['$scope', '$http', function ($scope, $http) {
	$scope.lists = null;
	$scope.time = function (time) {
		return new Date(time).getTime();
	}
	
	$http({
		method: 'get',
		url: '/articlelist'
	}).success(function (res) {
		$scope.lists = res;
		console.log(res);
	});	
}]);

app.controller('header', ['$scope', '$http', function ($scope, $http) {
	$scope.isLogin = false;
	$scope.username = null;
	$http({
		method: 'get',
		url: '/getsession',
	}).success(function (res) {
		if (res === '0') {
			return;
		}
		$scope.isLogin = true;
		$scope.username = res.user_name;
	});

	$scope.quite = function () {
		$http({
			method: 'get',
			url: '/quite',
		}).success(function (res) {
			if (res === '1') {
				console.log('退出成功');
				$scope.isLogin = false;	
			};
		})
	}
}]);

app.controller('signup', ['$scope', '$http', function ($scope, $http) {
	$scope.data = {
		username: '',
		email: '',
		password: ''
	}

	$scope.update = function () {
		$http({
			method: 'post',
			url: '/signup',
			data: $scope.data,
			dataType: 'json'
		}).success(function (res) {
			if (res === '1') {
				alert('注册成功');
				window.location.href = 'app.html#/signin'
			} else {
				alert(res);
			}
		})
	}
}]);

app.controller('signin', ['$scope', '$http', function ($scope, $http) {

	$scope.data = {
		account: '',
		password: ''
	}

	$scope.update = function () {
		$http({
			method: 'post',
			url: '/signin',
			data: $scope.data,
			dataType: 'json'
		}).success(function (res) {
			if (res === '1') {
				alert('登录成功');
				window.location.href = 'app.html'
			} else {
				alert(res);
			}
		})
	}
}]);

app.controller('publish', ['$scope', '$http', function ($scope, $http) {
	$scope.data = {
		aTitle: '',
		aContent: '',
		aType: ''
	}

	$scope.update = function () {
		$http({
			method: 'post',
			url: '/publish',
			data: $scope.data,
			dataType: 'json'
		}).success(function (res) {
			console.log(res);
		})
	}
}]);