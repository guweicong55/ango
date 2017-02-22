//文章详情
app.controller('article', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
	$('body').css('background', '#f7f8fa');
	var editor = new Simditor({   
		textarea: $('#editor'),
		//placeholder: '我的回复...',
		upload: true

	});
	$scope.data = { id:　$stateParams.id };
	$scope.user = '';
	$scope.resData = '';
	$scope.argumentsData = '';

	$scope.newArgument = '';
	
	$scope.push = 0;
	$scope.step = 0;
	$scope.pushClass = '';
	$scope.stepClass = '';

	//分页页数
	$scope.pageCount = [];
	$scope.curPage = 1;
	$scope.argumentsCount = null;


	// 获取文章
	$http({
		method: 'get',
		url: '/article',
		params: $scope.data,
	}).success(function (res) {
		$scope.resData = res;
		console.log(res);
		if (res.praise === 1) {
			$scope.pushClass = 'light-btn'
		} else if (res.praise === 0) {
			$scope.stepClass = 'light-btn'
		}
	});

	//关注文章
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
				item.isFollow = 0;
			} else if (res === '0') {
				window.location.href = 'app.html#/signin';
			}
		});
	}

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
			$scope.argumentsCount = res.count;
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
			data: { content: $('#editor').val(), id: $stateParams.id },
			dataType: 'json'
		}).success(function (res) {
			if (res.state === '1') {
				//alert('回复成功');
				$scope.argumentsCount ++;
				$scope.argumentsData.unshift({
					author: res.user,
					content:  $('#editor').val(),
					create_at: new Date().getTime()
				})
			} else {
				alert(res);
			}
			$('#editor').val('');
			$('.simditor-body').empty();
			$('.simditor-placeholder').show();
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
					$scope.resData.article.push += 1;
					$scope.pushClass = 'light-btn';
				} else {
					$scope.resData.step += 1;
					$scope.stepClass = 'light-btn';
				}
			} else if (res === '-1') {
				$scope.resData.article.push -= 1;
				$scope.pushClass = '';
			} else if (res === '-0') {
				$scope.resData.article.step -= 1;
				$scope.stepClass = '';
			} else if (res === '=1') {
				$scope.resData.article.push += 1;
				$scope.resData.article.step -= 1;
				$scope.pushClass = 'light-btn';
				$scope.stepClass = '';
			}  else if (res === '=0') {
				$scope.resData.article.push -= 1;
				$scope.resData.article.step += 1;
				$scope.pushClass = '';
				$scope.stepClass = 'light-btn';
			} else {
				window.location.href = 'app.html#/signin';
			}
		})
	}

}]);