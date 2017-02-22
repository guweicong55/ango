//主导航
app.controller('header', ['$scope', '$http', '$timeout', '$stateParams', function ($scope, $http, $timeout, $stateParams) {
	$scope.isLogin = false;
	$scope.username = null;
	$scope.searchInfo = '';
	$scope.searchShow = false;
	$scope.searchData = '';

	$scope.$watch('searchInfo', function (newValue, oldValue) {
		
		if (newValue === '') {
			$scope.searchShow = false;
			return;
		};

		$scope.searchShow = true;
		$scope.searchData = '';

		$timeout(function() {
			//进行搜索
			$http({
				method: 'get',
				url: '/search',
				params: { val: $scope.searchInfo }
			}).success(function (res) {
				console.log(res);
				if (res != '0') {
					$scope.searchData = res;
				};
			})
		}, 500);

	});

	$scope.searchOnfocus = function () {
		if ($scope.searchInfo === '') return;

		$scope.searchShow = true;	
	};

	$scope.searchOnblur = function () {
		$scope.searchShow = false;
	}

	$scope.clearVal = function () {
		$scope.searchInfo = ''; 
	}

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

//文章主页
app.controller('article-list', ['$scope', '$http', function ($scope, $http) {
	$scope.lists = [];
	$scope.page = 1;
	$scope.noMore = false;
	$scope.getArticleList = function () {
		if ($scope.page) {
			$http({
				method: 'get',
				url: '/articlelist',
				params: { page: $scope.page }
			}).success(function (res) {
				if (res.length > 0) {
					res.forEach(function (val, index) {
						$scope.lists.unshift(val);
					});
					$scope.page ++;
				} else {
					$scope.noMore = true;
					$scope.page = false;
				}
				console.log(res);			
			});
		}
		
	}
	$scope.getArticleList();

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
		if (res !== '0') {
			$scope.resData = res;
		}		
		console.log(res);
	});
}]);

//首页
app.controller('main', ['$scope', '$http', function ($scope, $http) {
	$scope.flag = null;

	$scope.tab = function (flag) {
		$scope.flag = flag;
	};
}]);

//个人中心
app.controller('personal-center', ['$scope', '$http', '$stateParams', '$ocLazyLoad', function ($scope, $http, $stateParams, $ocLazyLoad) {
	$ocLazyLoad.load('../css/common.css');
	$scope.perInfo = null;
	$scope.isEdit = null;
	$scope.gray = null;

	$http({
		method: 'get',
		url: '/personal',
		params: { name: $stateParams.name }
	}).success(function (res) {
		if (res === '0') {
			console.log('404');
			window.location.href = 'app.html';
			return;
		}
		$scope.isEdit = res.isEdit;
		$scope.perInfo = res.data;
		$scope.gray = res.isFocus;
	});

	$scope.onfocus = function (user) {
		$http({
			method: 'post',
			url: '/onfocus',
			dataType: 'json',
			data: { name: user, id: $scope.perInfo._id }
		}).success(function (res) {
			if (res === '0') {
				window.location.href = 'app.html#/signin';
				return;
			}

			if (res === '+1') {
				$scope.gray = 1;
			} else {
				$scope.gray = 0;
			}
			console.log(res);
		});
	}

	$scope.tabCount = null;

	//我的提问
	$scope.myQuestion = function (count) {	
		$http({
			method: 'get',
			url: '/personal-article',
			params: { user: $stateParams.name }
		}).success(function (res) {
			if (res !== '0') {
				$scope.resData = res;
			}
			$scope.tabCount = count;		
			console.log(res);
		});
	}
	$scope.myQuestion(1);


	//我关注的人
	$scope.fosData = null;
	$scope.myFocus = function (count) {

		$http({
			method: 'get',
			url: '/myfocus',
			params: { name: $stateParams.name }
		}).success(function (res) {
			$scope.tabCount = count;
			if (res != '0') {
				$scope.fosData = res;
			}					
			console.log(res);
		});
		$scope.tabCount = count;
	}

	//我关注的文章
	$scope.folArticleData = null;
	$scope.myFollow = function (count) {

		$http({
			method: 'get',
			url: '/myfollowarticle',
			params: { name: $stateParams.name }
		}).success(function (res) {
			$scope.tabCount = count;
			if (res != '0') {
				$scope.folArticleData = res;
			}					
			console.log(res);
		});

		$scope.tabCount = count;
	}
	
}]);

