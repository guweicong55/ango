var app = angular.module('app', ['ui.router', 'oc.lazyLoad']);

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
	$urlRouterProvider.when('/', '/main-article-list');

	$stateProvider.state('main', {
		url: '/',
		templateUrl: './temp/main.html',
		controller: 'main'
	}).state('signup', {
		url: '/signup',
		templateUrl: './temp/signup.html',
		controller: 'signup'
	}).state('signin', {
		url: '/signin',
		templateUrl: './temp/signin.html',
		controller: 'signin',
		/*resolve: {
			myCss: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load('../css/common.css');
			}]
		}*/
	}).state('publish', {
		url: '/publish',
		templateUrl: './temp/publish.html',
		controller: 'publish'
	}).state('personal-center', {
		url: '/personal-center/:name',
		templateUrl: './temp/personal-center.html',
		controller: 'personal-center'
	}).state('article', {
		url: '/article/:id',
		templateUrl: './temp/article.html',
		controller: 'article',
		resolve: {
			editer: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load([
					'../css/font-awesome.css',
					'../css/simditor.css',
					'./js/simditor-all.js',
					//'./js/articleCtrl.js'
				])
			}]
		}
	}).state('main.main-article-list', {
		url: 'main-article-list',
		templateUrl: './temp/main-article-list.html',
		controller: 'article-list'
	}).state('main.my-follow', {
		url: 'my-follow',
		templateUrl: './temp/my-follow.html',
		controller: 'follow'
	})
});

app.filter('toHtml', ['$sce',function($sce) {  
    return function(val) {  
        return $sce.trustAsHtml(val);   
    };  
}])
