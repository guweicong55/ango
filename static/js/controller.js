app.controller('main', ['$scope', '$http', function ($scope, $http) {
	$scope.lists = null;

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

app.controller('article', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
	$scope.data = { id:　$stateParams.id };
	$scope.user = '';
	$scope.resDate = '';
	$scope.argumentsData = '';

	$scope.newArgument = '';
	
	$scope.push = 0;
	$scope.step = 0;
	
	// 获取文章和评论
	$http({
		method: 'post',
		url: '/article',
		data: $scope.data,
		dataType: 'json'
	}).success(function (res) {
		$scope.resDate = res.article;
		$scope.argumentsData = res.arguments;

		//读取赞/踩的数量
		if (res.praise.length > 0) {
			for (var i = res.praise.length - 1; i >= 0; i--) {
				if (res.praise[i].is_good === 1) {
					$scope.push += 1;
				} else {
					$scope.step += 1;
				}
			};
		}
		console.log(res);
	});

	// 提交评论
	$scope.update = function () {
		$http({
			method: 'post',
			url: '/argument',
			data: { content: $scope.newArgument, id: $stateParams.id },
			dataType: 'json'
		}).success(function (res) {
			if (res.state === '1') {
				alert('回复成功');
				$scope.argumentsData.push({
					author: res.user,
					content: $scope.newArgument,
					create_at: new Date().getTime()
				})
			} else {
				alert(res);
			}
			$scope.newArgument = '';
		});
	}

	//点赞
	$scope.praise = function (gob) {
		$http({
			method: 'post',
			url: '/praise',
			data: { id: $stateParams.id, is_good: gob },
			dataType: 'json'
		}).success(function (res) {
			if (res === '1') {
				if (gob === 1) {
					$scope.push += 1;
				} else {
					$scope.step += 1;
				}
			} else {
				alert(res);
			}
		})
	}

}]);