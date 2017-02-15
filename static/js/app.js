var app = angular.module('app', ['ui.router']);

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
		controller: 'signin'
	}).state('publish', {
		url: '/publish',
		templateUrl: './temp/publish.html',
		controller: 'publish'
	}).state('article', {
		url: '/article/:id',
		templateUrl: './temp/article.html',
		controller: 'article'
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

app.service('count', function () {
	this.a = null;
})