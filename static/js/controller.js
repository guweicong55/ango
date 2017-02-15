//主导航
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
				//console.log('退出成功');
				$scope.isLogin = false;	
			};
		})
	}

	$scope.toMain = function () {
		window.location.href = 'app.html'
	}
}]);

//注册
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
				//alert('注册成功');
				window.location.href = 'app.html#/signin'
			} else {
				alert(res);
			}
		})
	}
}]);

//登录
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
				//alert('登录成功');
				window.location.href = 'app.html'
			} else {
				alert(res);
			}
		})
	}
}]);

//发布文章
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

//文章详情
app.controller('article', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
	$scope.data = { id:　$stateParams.id };
	$scope.user = '';
	$scope.resDate = '';
	$scope.argumentsData = '';

	$scope.newArgument = '';
	
	$scope.push = 0;
	$scope.step = 0;
	$scope.pushClass = '';
	$scope.stepClass = '';

	//分页页数
	$scope.pageCount = [];
	$scope.curPage = 1;


	// 获取文章
	$http({
		method: 'get',
		url: '/article',
		params: $scope.data,
	}).success(function (res) {
		$scope.resDate = res.article;

		if (res.praise === 1) {
			$scope.pushClass = 'light-btn'
		} else if (res.praise === 0) {
			$scope.stepClass = 'light-btn'
		}
	});

	// 获取分页评论
	$scope.getArgument = function (num) {
		$http({
			method: 'get',
			url: '/getargument',
			params: { id: $stateParams.id, count: num },
		}).success(function (res) {
			console.log(res);
			$scope.pageCount = [];
			$scope.argumentsData = res.data;
			$scope.curPage = num;
			if (res.count > 10) {
				for (var i = 1; i <= Math.ceil(res.count/10); i++) {
					if (i === $scope.curPage) {
						$scope.pageCount.push({ num: i, style: 'active' });
					} else {
						$scope.pageCount.push({ num: i, style: '' });
					}
					
				}
			}
		})
	}
	//初始化页面获取第一页评论数据
	$scope.getArgument(1);

	// 提交评论
	$scope.update = function () {
		$http({
			method: 'post',
			url: '/argument',
			data: { content: $scope.newArgument, id: $stateParams.id },
			dataType: 'json'
		}).success(function (res) {
			if (res.state === '1') {
				//alert('回复成功');
				$scope.argumentsData.unshift({
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
					$scope.resDate.push += 1;
					$scope.pushClass = 'light-btn';
				} else {
					$scope.resDate.step += 1;
					$scope.stepClass = 'light-btn';
				}
			} else if (res === '-1') {
				$scope.resDate.push -= 1;
				$scope.pushClass = '';
			} else if (res === '-0') {
				$scope.resDate.step -= 1;
				$scope.stepClass = '';
			} else if (res === '=1') {
				$scope.resDate.push += 1;
				$scope.resDate.step -= 1;
				$scope.pushClass = 'light-btn';
				$scope.stepClass = '';
			}  else if (res === '=0') {
				$scope.resDate.push -= 1;
				$scope.resDate.step += 1;
				$scope.pushClass = '';
				$scope.stepClass = 'light-btn';
			} else {
				window.location.href = 'app.html#/signin';
			}
		})
	}

}]);

//文章主页
app.controller('article-list', ['$scope', '$http', function ($scope, $http) {
	$scope.lists = null;

	$http({
		method: 'get',
		url: '/articlelist'
	}).success(function (res) {
		$scope.lists = res;
		console.log(res);
	});

	$scope.follow = function (id, item) {
		$http({
			method: 'post',
			url: '/follow',
			data: { article_id: id },
			dataType: 'json'
		}).success(function (res) {
			if (res === '1'){
				item.isFollow = 1;
			} else if (res === '-1') {
				item.isFollow = '';
			} else if (res === '0') {
				window.location.href = 'app.html#/signin';
			}
		});
	}
}]);

//我关注的文章
app.controller('follow', ['$scope', '$http', function ($scope, $http) {
	$scope.tab(2);
	$scope.resData = false;
	$scope.follow = function (id, item) {
		$http({
			method: 'post',
			url: '/follow',
			data: { article_id: id },
			dataType: 'json'
		}).success(function (res) {
			if (res === '1'){
				item.isFollow = 1;
			} else if (res === '-1') {
				item.isFollow = '';
			} else if (res === '0') {
				window.location.href = 'app.html#/signin';
			}
		});
	}	

	$http({
		method: 'get',
		url: '/getfollow'
	}).success(function (res) {
		$scope.resData = res;
		console.log(res);
	})
}]);

//首页
app.controller('main', ['$scope', '$http', function ($scope, $http) {
	$scope.flag = null;

	$scope.tab = function (flag) {
		$scope.flag = flag;
	};
}]);